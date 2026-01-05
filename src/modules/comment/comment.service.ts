import { prisma } from "../../lib/prisma"

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









export const commentServices = {
  createComment,
  getCommentByAuthorId,
  deleteComment
}