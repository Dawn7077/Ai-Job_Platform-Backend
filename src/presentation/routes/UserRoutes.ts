import { Router } from "express";
import { AuthController } from "../controller/AuthController.js";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { IAuthMiddleware } from "../middleware/authMiddleware.js";

export function AuthRoutes(
    authController:AuthController,
    tokenTool:ITokenService,
    authMiddleWare:IAuthMiddleware
){
    const router = Router()

    router.post('/signup-otp',(req,res,next)=>{
        authController.handleSendSignUpOTP(req,res,next)
    })
    
    router.post('/verify-signup',(req,res,next)=>{
        authController.handleRegister(req,res,next)
    })

    router.post('/google-login',(req,res,next)=>{
        authController.handleGoogleLogin(req,res,next)
    })

    router.post('/login',(req,res,next)=>{
        authController.handleLogin(req,res,next)
    })
    router.post('/refresh',(req,res,next)=>{
        authController.handleRefreshToke(req,res,next)
    })
    router.post('/logout',(req,res,next)=>{
        authController.handleLogout(req,res,next)
    })

    router.get('/getMe',authMiddleWare(tokenTool),(req,res,next)=>{
        authController.handleGetMe(req,res,next)
    })

    router.post('/forgot-password',(req,res,next)=>{
        authController.handleForgotPassword(req,res,next)
    })

    router.post('/reset-password',(req,res,next)=>{
        authController.handleResetPassword(req,res,next)
    })

    return router
}