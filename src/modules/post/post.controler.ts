import type { Request, Response } from "express"
import { postServices } from "./post.service"
import type { postStatus } from "../../../generated/prisma/enums"
import sortingAndPagination from "../../helper/paginationAndSorting"
import { getSystemErrorMessage } from "node:util"
import { UserRole } from "../../middllewares/auth"


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


// get my posts

const getMyPosts = async(req:Request, res:Response) => {
 try{
  const user = req.user
  console.log(user)
  const results = await postServices.getMyPosts(user?.id as string)
  return res.status(200).json(results)
 }
 catch(err){
  const errorMessage = (err instanceof Error) ? err.message : " data fetched failed"
 return res.status(400).json({
  error:errorMessage,
  details:err

  })
 }
}






// update own post

const updateOwnPost = async(req:Request, res:Response) => {
 try{
  const {id} = req.params
  const data = req.body
  const user = req.user
  console.log(user);
  const isAdmin = user?.role === UserRole.ADMIN
  console.log(isAdmin);
 const results = await postServices.updateOwnPost(id as string, user?.id as string, data, isAdmin)
 res.status(200).json(results)
 }
 catch(err){
  const errorMessage = (err instanceof Error)? err.message : "update failed"
  res.status(400).json({
    error:errorMessage,
    details:err
  })
 }
}




// delete post

const deletePost = async(req:Request, res:Response) => {
 try{
  const {postId} = req.params
  const user = req.user
  const isAdmin = user?.role === UserRole.ADMIN
  const results = await postServices.deletePost(postId as string, isAdmin, user?.id as string)
  return res.status(200).json(results)

 }

 catch(err){
  const errorMessage = (err instanceof Error) ? err.message : "delete failed"
  return res.status(400).json({
    error:errorMessage,
    details:err
  })
 }
}



export const postControler = {
   getPost,
   getPostById,
    createPost,
    getMyPosts,
    updateOwnPost,
    deletePost
}