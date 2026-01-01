
import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// const getPost = async(payloads:{search : string | undefined, tags : string[] | [], 
//    isFeatured : boolean | undefined, status:postStatus | undefined,
//   authorId:string|undefined}) => {

//   const andConditions = []

//   if(payloads.search){
//     andConditions.push(   { OR:[

//         {
//           title:{
//             contains:payloads.search as string
//           }
//         },


//         {
//           content:{
//             contains:payloads.search as string
//           }
//         },


//         {
//           tags:{
//             has:payloads.search as string
//           }
//         },


      



//       ]})

// }



//   if(payloads.tags.length> 0){
//    andConditions.push({
//    tags:{
//         hasEvery : payloads.tags 
//       }
//    })
//   }


//    if(typeof payloads.isFeatured === 'boolean'){
//     andConditions.push({
//     isFeatured : payloads.isFeatured
//     })
//   }


//   if(payloads.status){
//     andConditions.push({
//       status: payloads.status
//     })
//   }


//   if(payloads.authorId){
//     andConditions.push({
//       authorId:payloads.authorId
//     })
//   }

//   const results = await prisma.post.findMany({
//     //  where: {
//     //   OR : [
//     //     {
//     //      title : {
//     //   contains : payloads.search as string,
//     //   mode:"insensitive"
//     //  }
//     //     },

//     //    {
//     //    content:{
//     //   contains:payloads.search as string,
//     //   mode: "insensitive"
//     //  }
//     //    },

//     //    {
//     //     tags: {
//     //       has: payloads.search as string
//     //     }
//     //    }


   
//     //   ]
//     //  } 

//     where : {
  
//  AND: andConditions

//  }
//   })
//   return results
// }



const getPost = async(payloads:{search:string|undefined, tags:string[] })=> {

  const andConditions:any[] = []
 
  // search with title, content
if(payloads.search){
  andConditions.push({
  OR:[
    {
     title:{
    contains:payloads.search,
    mode:"insensitive"
   }
  },

   
    {
      content:{
    contains:payloads.search,
    mode:"insensitive"
    }
    },



    {
      tags:{
        has:payloads.search
        
      }
    }


  ]
   
  })


  if(payloads.tags.length>0){
   andConditions.push({
    tags:{
      hasEvery:payloads.tags
    }
   })
  }



 const results = prisma.post.findMany({
   where:{
    AND: andConditions
    }
   
 })
 return results
}
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