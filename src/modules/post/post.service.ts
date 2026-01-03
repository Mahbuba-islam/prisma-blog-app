

import type { Post, postStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { PostWhereInput } from "../../../generated/prisma/models";

const getPost = async(search:string|undefined, tags:string[] | [], 
  isFeatured:boolean | undefined, status:postStatus | undefined,
   authorId:string|undefined, limit:number, skip:number,
  sortBy:string, sortOrder:string) => {

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


// filter with status 

if(status){
  andConditions.push({
    status
  })
}


//filter with authorId

if(authorId){
  andConditions.push({
    authorId
  })
}

  const results = await prisma.post.findMany({
    take:limit,
    skip,
    where:{
      AND:andConditions
    },
    orderBy: {
      [sortBy]:sortOrder
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