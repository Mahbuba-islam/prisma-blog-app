import type { Request, Response } from "express"
import { postServices } from "./post.service"
import type { postStatus } from "../../../generated/prisma/enums"
import sortingAndPagination from "../../helper/paginationAndSorting"


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


   // filter with status

   const status = req.query.status as postStatus | undefined

   //filter with authorId

   const authorId = req.query.authorId as string | undefined


   //pagination

  

   //sorting

   
   const options = req.query
   
      const {page,limit,skip, sortBy, sortOrder} = sortingAndPagination(options)

  
  const results = await postServices.getPost(searchString, tags, isFeaturedBoolean,
     status, authorId, page, limit, skip, sortBy, sortOrder)

   res.status(200).json(results)
  }
  
 catch(err){
  res.status(400).json({
    error :'faild to get post',
    details:err
  })
 }
}





// getpostBy Id

const getPostById = async(req:Request, res:Response)=>{
  try{
    const {id} = req.params 
   const results = await postServices.getPostById(id)
   res.status(200).json(results)
  }
  catch(err){
    res.status(400).json({
    error:'faild to get post by this id',
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
   getPostById,
    createPost
}