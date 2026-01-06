
import type { Request, Response } from "express";
import { commentServices } from "./comment.service"

const createComment = async (req:Request, res:Response) => {
    
 try{
    const user = req.user
    req.body.authorId = user?.id
  const results = await commentServices.createComment(req.body)
  console.log(results);
  return res.status(200).json(results)
 }
 catch(e){
     return res.status(400).json({
        error:"post creation failed",
        details:e
    })
    }
 }




 const getCommentByAuthorId = async(req:Request, res:Response)=> {
    try{
        const {authorId} = req.params
        const results = await commentServices.getCommentByAuthorId(authorId as string)
        return res.status(200).json(results)
    }
    catch(err){
       return res.status(400).json({
            error:'failed to get comment',
            details:err
        })
    }
 }



 // delete comment 

 const deleteComment = async(req:Request, res:Response)=>{
    try{
        const {id} = req.params
        const user = req.user
        const results = await commentServices.deleteComment(id as string, user?.id as string)
        res.status(200).json(results)
    }
    catch(err){
        res.status(400).json({
            error:"failed to delete comment",
            details:err
        })
    }
 }



//update comment

const updateComment = async(req:Request, res:Response)=>{
    try{
   const {commentId} = req.params
   const user = req.user 
   const commentData = req.body
   const results = await commentServices.updatedComment(commentId as string, commentData, user?.id as string, )
   return res.status(200).json(results)
    }
    catch(err){
     return res.status(400).json({
        error:'update failed',
        details:err
     })
    }
}


 
export const commentControler = {
    createComment,
    getCommentByAuthorId,
    deleteComment,
    updateComment
}