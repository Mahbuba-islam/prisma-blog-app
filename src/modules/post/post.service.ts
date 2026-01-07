

import { commentStatus, type Post, type postStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { error } from "node:console";

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





// get my posts

const getMyPosts = async(authorId:string)=>{
  console.log(authorId);
 
   await prisma.user.findUniqueOrThrow({
    where:{
      id:authorId,
      status:"ACTIVE"
    }
  })


  const results = await prisma.post.findMany({
   where:{
    authorId
   },
   orderBy:{
    createdAt:"desc"
   },
   include:{
    _count:{
      select:{
        comments:true
      }
    },
    comments:true
   },

   


  })

 // total posts
//  const totalPosts = await prisma.post.count({
//   where:{
//     authorId
//   }
//  })

//use aggeregate
const totalPosts = await prisma.post.aggregate({
  _count:{
    id:true
  },
  where:{
    authorId
  }
})

   return {
    data:results,
    totalPosts
   }
}



// updates own posts
// if user - user can't update isFeatured 
// admin update all user posts
const updateOwnPost = async( postId:string, userId:string, data:Partial<Post>, isAdmin:Boolean ) => {
 
  const postData = await prisma.post.findUniqueOrThrow({
    where:{
      id:postId
    },
    select:{
      id:true,
      authorId:true
    }
  })


if(!isAdmin && (postData.authorId !== userId)){
  throw new Error ("You are not the owner of this post")
}

if(!isAdmin){
  delete data.isFeatured
}


const results = await prisma.post.update({
  where:{
    id:postId
    
  },
  data
 })

 return results
}



// delete post 
// user delete their own posts
// admin delete every posts


const deletePost = async(postId:string, isAdmin:boolean, userId:string)=>{
   console.log(postId, isAdmin, userId);
  //check this post exists
   const postData = await prisma.post.findUniqueOrThrow({
    where:{
      id:postId
    },
    select:{
      id:true,
      authorId:true
    }
})


if(!isAdmin && (postData.authorId !== userId  ) ) {
  throw new Error ("you are not the owner of this post")
}
  

return await prisma.post.delete({
  where:{
    id:postId
  }
})

}


// dashboard

const






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
    getMyPosts,
    updateOwnPost,
    deletePost
    
}