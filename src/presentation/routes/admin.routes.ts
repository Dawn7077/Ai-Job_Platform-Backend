import { Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/services/i-token.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizeRole } from "../middleware/role.middleware";
import { UserRole } from "../../shared/constants/roles.constant";
import { AdminController } from "../controller/admin.controller";


export function AdminRouter(
    adminController:AdminController,
    tokenTool:ITokenService,

){
    const router = Router()
    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRole.ADMIN))

     
    router.get('/pending-companies',(req,res,next)=>{
        adminController.handleGetPendingUsers(req,res,next)
    })

    router.post('/verify-company',(req,res,next)=>{
        adminController.verifyCompany(req,res,next)
    })

    router.get('/users',(req,res,next)=>{
        adminController.getUsers(req,res,next)
    })

    router.patch('/users/:id/status',(req,res,next)=>{
        adminController.UpdateUserStatus(req,res,next)
    })

    router.patch('/users/:id/role',(req,res,next)=>{
        adminController.UpdateUserRole(req,res,next)
    })
    router.delete('/users/:id',(req,res,next)=>{
        adminController.DeleteUser(req,res,next)
    })

    return router
}