import type { Request, Response } from "express"
import { postServices } from "./post.service"

// const getPost = async(req:Request, res:Response) => {
//  try{
//    const {search} = req.query
//    console.log({search});
     //  const searchString = typeof search === 'string' ? search : undefined


//    const tags = req.query.tags ? (req.query.tags as string).split(',') : []

//    const isFeatured = req.query.isFeatured ? 
//    req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined : undefined

//  

//    const status = req.query.status as postStatus | undefined


//    const authorId = req.query.authorId as string | undefined

//    const results = await postServices.getPost({search:searchString, tags, isFeatured, status, authorId})
//    res.status(200).json(results)

//   }
//   catch(err){
//     res.status(400).json({
//       error:"post getting failed",
//       details:err
//     })
//   }
 
// }

const getPost = async(req:Request, res:Response) => {
  try{

     const search = req.query.search 
    const searchString = typeof search === 'string' ? search :undefined

    const tags = req.query.tags as string[]
    
   const results = await postServices.getPost({search:searchString, tags})
  
 

  res.status(200).json(results)
  }
  catch(err){
    res.status(401).json({
      error:'failed to get post',
      details:err
    })
   
  }
}





const createPost = async (req:Request, res:Response) => {
    
    try{ 
      const user = req.user
      if(!user){
        return res.status(400).json({
        error:"unauthorized",
        
    })
      }

    const result = await postServices.createPost(req.body, user.id as string)
   return res.send(result)
    }
    catch(e){
     return res.status(400).json({
        error:"post creation failed",
        details:e
    })
    }
}

export const postControler = {
  getPost,
    createPost
}