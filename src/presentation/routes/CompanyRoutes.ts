import { Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export function CompanyRouter(companyController:any,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))

    router.get('/home',(req:Request,res:Response)=>{
        companyController.getHome(req,res)
    })
    router.get('/jobs',(req:Request,res:Response)=>{
        companyController.getJobs(req,res)
    })
     
}