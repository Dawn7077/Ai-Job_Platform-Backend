import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../../shared/utils/app-errors.util";
import { StatusCode } from "../../shared/constants/status-code.constant";
import { AuthMessages } from "../../shared/constants/auth-messages.constant";

export type IAuthorizeRole = (...allowedRoles:string[])=>RequestHandler


export const authorizeRole:IAuthorizeRole = (...allowedRoles:string[]):RequestHandler=>{
    return(req:Request,_:Response,next:NextFunction):void=>{
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