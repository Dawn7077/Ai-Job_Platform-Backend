import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/AppErrors.js";


export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            success:false,
            errorCode:err.errorCode,
            message:err.message
        })
    }

    console.error('Unhandled_Error',err)
    return res.status(500).json({
        success:false,
        errorCode:'INTERNAL_SERVER_ERROR',
        message:'An unexpected internal server error occured.'
    })
}