
import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getPost = async(payloads:{search : string | undefined}) => {
  const results = await prisma.post.findMany({
     where: {
     title : {
      contains : payloads.search as string,
      mode:"insensitive"
     }
     } 
  })
  return results
}








const createPost = async (data: Omit<Post, 'id' | 'createdAt'| 'updatedAt' | "isFeatured" | 'authorId'>, userId:string) => {
  const result = await prisma.post.create({
  data:{
    ...data,
    authorId:userId
  }
  })
  return result
} 

export const postServices = {
  getPost ,
    createPost
    
}