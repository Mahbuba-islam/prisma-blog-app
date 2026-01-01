import type { Request, Response } from "express"
import { postServices } from "./post.service"


const getPost = async(req:Request, res:Response) => {
 try{
   const {search} = req.query
   console.log({search});
   const tags = req.query.tags ? (req.query.tags as string).split(',') : []
   const searchString = typeof search === 'string' ? search : undefined
   const results = await postServices.getPost({search:searchString, tags})
   res.status(200).json(results)

  }
  catch(err){
    res.status(400).json({
      error:"post getting failed",
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