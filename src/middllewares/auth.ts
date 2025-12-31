import type { NextFunction, Request, Response } from "express"
import {auth as betterAuth} from '../lib/auth'
import { fromNodeHeaders } from "better-auth/node";


export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

declare global{
    namespace Express {
        interface Request{
            user?:{
                id:string | undefined
                name:string | undefined
                email:string | undefined
                role:string | undefined | null
                emailVerified:boolean | undefined
            }
        }
    }
}

const auth = (...roles: UserRole[]) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        
       try{
 //get user session
        const session = await betterAuth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    
    // console.log(session?.user);

    // if session has no data
    if(!session){
      return res.status(401).json({
            success:false,
            message:"You are not authorized"
        })
    }
 

   // if email not verified
    if(!session?.user.emailVerified){
   return res.status(403).json({
            success:false,
            message:"email verification required please verify your email"
        })
    }


    req.user = {
    id: session?.user.id,
    email: session?.user.email,
    name: session?.user.name,
    role: session?.user.role,
    emailVerified: session?.user.emailVerified

    }


    // role cheack
    if(roles.length && !roles.includes(req.user.role as UserRole)){
        return res.status(403).json({
            success:false,
            message:"forbidden ! you don't have permission to access this resources"
        })
    }
    
     next()
       }catch(err){
        next(err)
       }
    }
   
}

export default auth;