import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/AppErrors.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";
import {success, z} from 'zod'
import { StatusCode } from "../../shared/StatusCode.js";

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof AppError){
        console.log('AppError=>',err.message)
        return res.status(err.statusCode).json({
            success:false,
            errorCode:err.errorCode,
            message:err.message
        })
    }

    if(err instanceof z.ZodError){
        console.log('ZodError=>',err.message)
        return res.status(StatusCode.BAD_REQUEST).json({
            success:false,
            errorCode:'VALIDATION_ERROR',
            message:err.message, 
        })
    }
    
    console.log(err.message)
    console.error('Unhandled_Error',err)
    return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success:false,
        errorCode:'INTERNAL_SERVER_ERROR',
        message:AuthMessages.INTERNAL_ERROR
    })
}