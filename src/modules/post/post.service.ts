

import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { PostWhereInput } from "../../../generated/prisma/models";

const getPost = async(search:string|undefined, tags:string[] | [], 
  isFeatured:boolean | undefined) => {

  const andConditions:PostWhereInput[] = []

  if(search){
    andConditions.push({
     OR:[

      {
        title:{
        contains:search
      }

      },


      {
        content:{
       contains:search
      }

      },
     
      

      {
       tags:{
        has:search
      }
      }
     ] 

    })
  }


  //tags

  if(tags.length>0){
    andConditions.push({
      tags:{
        hasEvery: tags
      }
    })
  }

//isFeatured

if(typeof isFeatured === 'boolean'){
  andConditions.push({
    isFeatured
  })
}

  const results = await prisma.post.findMany({
    where:{
      AND:andConditions
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
    getPost,
    createPost
    
}