import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/services/i-token.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { UserRole } from "../../shared/constants/roles.constant";
import { ApplicationController } from "../controller/application.controller";


export function ApplicationRouter(
    applicationController:ApplicationController,
    tokenService:ITokenService,
){
    const router = Router()

    router.use(authMiddleware(tokenService)) 

    router.post('/apply',authorizeRole(UserRole.CANDIDATE),(req:Request,res:Response,next:NextFunction)=>{
        applicationController.apply(req,res,next)
    })

    router.get('/my-applications',authorizeRole(UserRole.CANDIDATE),(req:Request,res:Response,next:NextFunction)=>{
        applicationController.AllMyApplications(req,res,next)
    })

    router.get('/:id',(req:Request,res:Response,next:NextFunction)=>{
        applicationController.getApplicationById(req,res,next)
    })




   



    return router
}