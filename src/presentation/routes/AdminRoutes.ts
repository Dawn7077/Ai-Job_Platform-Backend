import { Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import { UserRoleConstants } from "../../shared/constants/roles.js";
import { AdminController } from "../controller/AdminController.js";


export function AdminRouter(
    adminController:AdminController,
    tokenTool:ITokenService,

){
    const router = Router()
    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRoleConstants.ADMIN))

     
    router.get('/pending-companies',(req,res,next)=>{
        adminController.handleGetPendingUsers(req,res,next)
    })

    router.post('/verify-company',(req,res,next)=>{
        adminController.verifyCompany(req,res,next)
    })

    return router
}