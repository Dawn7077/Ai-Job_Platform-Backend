import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { UserRoleConstants } from "../../shared/constants/roles.js";
import { ApplicationController } from "../controller/ApplicationController.js";


export function ApplicationRouter(
    applicationController:ApplicationController,
    tokenService:ITokenService,
){
    const router = Router()

    router.use(authMiddleware(tokenService)) 

    router.post('/apply',authorizeRole(UserRoleConstants.CANDIDATE),(req:Request,res:Response,next:NextFunction)=>{
        applicationController.apply(req,res,next)
    })

    router.get('/my-applications',authorizeRole(UserRoleConstants.CANDIDATE),(req:Request,res:Response,next:NextFunction)=>{
        applicationController.AllMyApplications(req,res,next)
    })

    router.get('/:id',(req:Request,res:Response,next:NextFunction)=>{
        applicationController.getApplicationById(req,res,next)
    })




   



    return router
}