import { HttpStatusCode, StatusCode } from "./StatusCode.js";

export class AppError extends Error{
    readonly statusCode:HttpStatusCode;
    readonly errorCode:string;
    // private readonly isOperational:boolean
    constructor(
        message:string,
        statusCode:HttpStatusCode = StatusCode.INTERNAL_SERVER_ERROR,
        errorCode:string = 'INTERNAL_SERVER_ERROR'
    ){
        super(message);
        this.statusCode = statusCode
        this.errorCode = errorCode

        Error.captureStackTrace(this,this.constructor)
    }
}