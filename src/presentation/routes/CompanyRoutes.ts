import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { UserRoleConstants } from "../../shared/constants/roles.js";
import { CompanyController } from "../controller/CompanyController.js";

export function CompanyRouter(
    companyController:CompanyController,
    tokenService:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenService))
    router.use(authorizeRole(UserRoleConstants.COMPANY))
    
    // router.get('/home',(req:Request,res:Response)=>{
    //     companyController.getHome(req,res)
    // })


    router.get('/jobs',(req:Request,res:Response,next:NextFunction)=>{
        companyController.getJobs(req,res,next)
    })
    router.post('/jobs',(req:Request,res:Response,next:NextFunction)=>{
        companyController.postJob(req,res,next)
    })
     
    return router
}