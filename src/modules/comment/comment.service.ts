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


export const commentServices = {
  createComment
}