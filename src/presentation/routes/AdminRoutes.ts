import { Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/repo/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { UserRoleConstants } from "../../shared/constants/roles.js";


export function AdminRouter(adminController:any,tokenTool:ITokenService){
    const router = Router()
    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRoleConstants.ADMIN))

    router.get('/home',(req:Request,res:Response)=>{
        adminController.getHome(req,res)
    })
    router.get('/manage-users',(req:Request,res:Response)=>{
        adminController.getManaging(req,res)
    })
}