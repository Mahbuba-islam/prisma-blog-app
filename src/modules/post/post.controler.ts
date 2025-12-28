import type { Request, Response } from "express"
import { postServices } from "./post.service"

const createPost = async (req:Request, res:Response) => {
    res.send("create post")
   
    try{ 
    const result = await postServices.createPost(req.body)
    res.status(201).json(result)
    }
    catch(e){
    res.status(400).json({
        error:"post creation failed",
        details:e
    })
    }
}

export const postControler = {
    createPost
}