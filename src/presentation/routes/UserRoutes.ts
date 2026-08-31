import { Router } from "express";
import { AuthController } from "../controller/AuthController.js";
import { ITokenService } from "../../application/interface/ITokenService.js";
import { IAuthMiddleware } from "../middleware/authMiddleware.js";

export function AuthRoutes(
    authController:AuthController,
    tokenTool:ITokenService,
    authMiddleWare:IAuthMiddleware
){
    const router = Router()

    router.post('/signup',(req,res)=>{
        authController.handleRegister(req,res)
    })
    router.post('/login',(req,res)=>{
        authController.handleLogin(req,res)
    })
    router.post('/refresh',(req,res)=>{
        authController.handleRefreshToke(req,res)
    })
    router.post('/logout',(req,res)=>{
        authController.handleLogout(req,res)
    })

    router.get('/getMe',authMiddleWare(tokenTool),(req,res)=>{
        authController.handleGetMe(req,res)
    })

    return router
}