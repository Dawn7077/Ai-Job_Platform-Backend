import { Response } from "express"

export interface ApiResponse<T=any>{
    success:boolean
    message?:string
    error?:string
    data?:T
}

export class ResponseHelper{
    static success<T>(res:Response,statuscode:number,data?:T, message?:string){
        return res.status(statuscode).json({
            success:true,
            ...(message && {message}),
            ...(data!==undefined && {data})
        })
    }
    static error<T>(res:Response,statuscode:number,error:string){
        return res.status(statuscode).json({
            success:false,
            error
        })
    }
}