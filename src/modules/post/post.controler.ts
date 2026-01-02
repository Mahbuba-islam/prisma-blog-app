import type { Request, Response } from "express"
import { postServices } from "./post.service"


const getPost = async(req:Request, res:Response) => {
  try{

    const search = req.query.search
     // typeof search judi string hoi tahole search er value ta bosaw , r na hole undifiend bosaw
   const searchString = typeof search === 'string' ? search : undefined

   const tags = req.query.tags ? (req.query.tags as string).split(',') : []
  
   // isFeatured
   const isFeatured = req.query.isFeatured 

  const isFeaturedBoolean = isFeatured ? 
  isFeatured === 'true' ? true : 
  isFeatured === 'false' ? false : undefined :undefined

   const results = await postServices.getPost(searchString, tags, isFeaturedBoolean)
   res.status(200).json(results)
  }
  
 catch(err){
  res.status(400).json({
    error :'faild to get post',
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