import { error } from "node:console"
import { prisma } from "../../lib/prisma"
import type { commentStatus } from "../../../generated/prisma/enums"

const createComment = async (payload:{

 content:string,
 authorId:string,
 postId:string,
 parentId?:string
 
}) => {
    
    // cheack postId
    await prisma.post.findUnique({
        where : {
            id: payload.postId
        }
    })



if(payload.parentId){
 await prisma.comments.findMany({
    where:{
        parentId:payload.parentId
    }
 })
}

 const results = prisma.comments.create({
   data: payload
   })
 
  return results
 
}



// get comments by authorId

const getCommentByAuthorId = async(authorId:string) => {
  console.log(authorId);
  const results = await prisma.comments.findMany({
    where:{
      authorId
    }
  })
console.log(results);
  return results
}


//delete comment
const deleteComment = async(id:string, authorId:string)=>{

 const commentData = await prisma.comments.findFirst({
  where:{
    id,
    authorId
  },

  select:{
    id:true
  }

 })

 if(!commentData){
  throw new Error("your provided ionput is invalid")
 }


    const results = await prisma.comments.delete({
      where:{
        id:commentData.id
      }
    })
    return results
 }



 // update comment

 const updatedComment = async(commentId:string, data:{content?:string, status?:commentStatus }, authorId:string)=> {
    console.log({commentId,data,authorId});
  const commentData = await prisma.comments.findFirst({
    where:{
      id:commentId,
      authorId

    },
    select:{
      id:true
    }

  })
   
  if(!commentData){
    throw new Error("your provided input is invalid")
  }
  
 const results = await prisma.comments.update({
    where: {
      id: commentId,
      authorId
    },
    data
  });

return results
 }


// admin can update comment status

const moderateComment = async(commentId:string, data:{status:commentStatus}) => {
 const commentData =  await prisma.comments.findUniqueOrThrow({
    where:{
      id:commentId
    }
  })


  if(commentData.status === data.status){
    throw new Error (`status ${data.status} already up to date `)
  }



  const results = await prisma.comments.update({
    where:{
      id:commentId
    },
    data
  })

  return results
}





export const commentServices = {
  createComment,
  getCommentByAuthorId,
  deleteComment,
  updatedComment,
  moderateComment
}