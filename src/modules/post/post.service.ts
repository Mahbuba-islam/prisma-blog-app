
import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getPost = async(payloads:{search : string | undefined, tags : string[] | []}) => {

  const andConditions = []

  if(payloads.search){
    andConditions.push(   { OR:[

        {
          title:{
            contains:payloads.search as string
          }
        },


        {
          content:{
            contains:payloads.search as string
          }
        },


        {
          tags:{
            has:payloads.search as string
          }
        }



      ]})
  }



  if(payloads.tags.length> 0){
   andConditions.push({
   tags:{
        hasEvery : payloads.tags 
      }
   })
  }

  const results = await prisma.post.findMany({
    //  where: {
    //   OR : [
    //     {
    //      title : {
    //   contains : payloads.search as string,
    //   mode:"insensitive"
    //  }
    //     },

    //    {
    //    content:{
    //   contains:payloads.search as string,
    //   mode: "insensitive"
    //  }
    //    },

    //    {
    //     tags: {
    //       has: payloads.search as string
    //     }
    //    }


   
    //   ]
    //  } 

    where : {
  
 AND: andConditions

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