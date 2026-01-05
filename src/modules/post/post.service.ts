

import { commentStatus, type Post, type postStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { PostWhereInput } from "../../../generated/prisma/models";

const getPost = async(search:string|undefined, tags:string[] | [], 
  isFeatured:boolean | undefined, status:postStatus | undefined,
   authorId:string|undefined, page:number, limit:number, skip:number, 
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

  const allPost = await prisma.post.findMany({
    take:limit,
    skip,
    where:{
      AND:andConditions
    },
    orderBy: {
      [sortBy]:sortOrder
    },


   include:{
    _count:{
      select:{comments:true}
    }
   }
  })


// metedata

// total data count
 
const totalData = await prisma.post.count({
   where:{
      AND:andConditions
    }
})


  return {
    data:allPost,
   totalData,
   page,
   limit,
   totalPages:Math.ceil(totalData/limit)

  }
}




// get post by id

const getPostById = async(postId:string|undefined) => {
   
//  return await prisma.$transaction(async(tx)=> {

//  })

  return await prisma.$transaction(async(tx) => {
     // update view count
  await tx.post.update({
    where:{
      id:postId!
    },
    data:{
     views: {
      increment:1
     }
    }
  })




   
  const postData = await tx.post.findUnique({
    where : {
      id:postId!
    },

    include:{
      comments:{
        where:{
          parentId:null,
          status:commentStatus.APPORVED
        },
        
      orderBy:{createdAt:"desc"},
     include:{
          replies:{
            where:{
              status:commentStatus.APPORVED
            },

            orderBy:{createdAt:'asc'},
            include:{
              replies:{
              where:{
              status:commentStatus.APPORVED
            },

            orderBy:{createdAt:'asc'},
              
                include:{
                  replies:{
                    where:{
                      status:commentStatus.APPORVED
                    },

                    orderBy:{createdAt:'asc'}
                  }
                }
              }
            }
          }
        }
      },
      _count:{
        select:{
          comments:true
        }
      }
    },


    
    
  })



  return postData
  })



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
    getPostById,
    createPost,
    
}