import { NextFunction, Request, RequestHandler, Response } from "express"
import { ITokenService } from "../../infrastructure/repo/ITokenService.js"
import { StatusCode } from "../../shared/StatusCode.js"

declare global{
    namespace Express{
        interface Request{
            user?:{
                userId:string 
                role:string
            }
        }
    }
}
export interface authReq extends Request{
    user?:{
        userId:string
        // email:string
        role:string
    }
}

export type IAuthMiddleware = (tokenTool:ITokenService)=>RequestHandler

export const authMiddleware:IAuthMiddleware = (tokenTool:ITokenService)=>{
    return (req:Request,res:Response,next:NextFunction):void=>{
        try {
            const accesstToken = req.cookies?.access_token

            if(!accesstToken){
                res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:"Unauthorized: NO Token provided."
                })
                return
            }

            const decodedUser =  tokenTool.verifyAccessToken(accesstToken)

            req.user = decodedUser 

            console.log(req.user)

            next()

        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                message:'Invalid or expired access Token.'
            })
        }
    }
}
