
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



export const commentControler = {
    createComment
}