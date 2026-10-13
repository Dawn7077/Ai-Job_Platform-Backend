import { Response } from "express"

export interface ApiResponse<T=any>{
    success:boolean
    message?:string
    error?:string 
    [key:string]:any
}

export class ResponseHelper{
    static success<T>(
        res:Response,
        statuscode:number,
        payloadOrMessage?:T |string, 
        message?:string,
    ){
        if(typeof payloadOrMessage === 'string'){
            return res.status(statuscode).json({
                success:true,
                message:payloadOrMessage
            })
        }

        return res.status(statuscode).json({
            success:true,
            ...(message && {message}),
            ...payloadOrMessage,
            // ...(payloadOrMessage!==undefined && {payloadOrMessage}) ,
        })
    }
    static error<T>(res:Response,statuscode:number,error:string){
        return res.status(statuscode).json({
            success:false,
            error
        })
    }
}