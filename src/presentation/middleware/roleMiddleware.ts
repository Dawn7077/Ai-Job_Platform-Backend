import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";

export type IAuthorizeRole = (...allowedRoles:string[])=>RequestHandler


export const authorizeRole:IAuthorizeRole = (...allowedRoles:string[]):RequestHandler=>{
    return(req:Request,res:Response,next:NextFunction):void=>{
        if(!req.user || !req.user.role){
            return next(new AppError(
                AuthMessages.UNAUTHORIZED,
                StatusCode.UNAUTHORIZED,
                'UNAUTHORIZED'
            ))
        }
        const hasPermission = allowedRoles.includes(req.user.role)

        if(!hasPermission){
            return next(new AppError(
                AuthMessages.FORBIDDEN,
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            ))
        }

        next()
    }
}