import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/I-Services/ITokenService";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";
import { UserRoleConstants } from "../../shared/constants/roles";
import { ApplicationController } from "../controller/ApplicationController";


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