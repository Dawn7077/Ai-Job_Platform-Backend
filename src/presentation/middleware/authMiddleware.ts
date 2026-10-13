import { NextFunction, Request, RequestHandler, Response } from "express"
import { ITokenService } from "../../application/interface/I-Services/ITokenService"
import { StatusCode } from "../../shared/StatusCode"
import { AuthMessages } from "../../shared/constants/authMessages"
import { UserStatus } from "../../domain/entities/User"
import redisClient from "../../infrastructure/db/Redis/redisClient"

declare global{
    namespace Express{
        interface Request{
            user?:{
                userId:string 
                role:string
                status:UserStatus
            }
        }
    }
}
export interface authReq extends Request{
    user?:{
        userId:string 
        role:string
        status:UserStatus
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
                    message:AuthMessages.NO_TOKEN
                })
                return
            }

            const decodedUser =  tokenTool.verifyAccessToken(accesstToken)


            if(decodedUser.status ==='DELETED'){
                res.status(StatusCode.FORBIDDEN).json({
                    success:false,
                    message:AuthMessages.DELETED_ACCOUNT
                })
                return
            }
            if(decodedUser.status ==='SUSPENDED'){
                res.status(StatusCode.FORBIDDEN).json({
                    success:false,
                    message:AuthMessages.SUSPENDED_ACCOUNT
                })
                return
            }

            req.user = decodedUser 

            // console.log(req.user)

            next()

        } catch (error) {
            res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                message:'Invalid or expired access Token.'
            })
        }
    }
}
