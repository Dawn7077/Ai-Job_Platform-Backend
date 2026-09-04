import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../shared/StatusCode.js";
import { IRegisterUser } from "../../application/interface/IRegister.js";
import { ILogin } from "../../application/interface/ILogin.js";
import { IRefreshToken } from "../../infrastructure/repo/IRefreshToken.js";
import redisClient from "../../infrastructure/db/redisClient.js";
import { ITokenService } from "../../infrastructure/repo/ITokenService.js";
import { IGetMe } from "../../application/interface/IGetMe.js";
import { IForgotPasswordUseCase } from "../../application/use-case/ForgotPassWord.js";
import { IResetPasswordUseCase } from "../../application/use-case/ResetPassword.js";
import { ISignUpOTP } from "../../application/use-case/SignUpOTP.js";
import { IGoogleService } from "../../application/use-case/GoogleLoginUseCase.js";

export class AuthController{
    constructor(
        private registerTool:IRegisterUser,
        private signUpOtpTool:ISignUpOTP,
        private loginTool:ILogin,
        private refreshTool:IRefreshToken,
        private tokenTool:ITokenService,
        private getMeTool:IGetMe,
        private forgotPasswordTool:IForgotPasswordUseCase,
        private resetPasswordTool:IResetPasswordUseCase,
        private googleServiceTool:IGoogleService

    ){}

    async handleSendSignUpOTP(req:Request,res:Response,next:NextFunction){
        try {
            const {name,email,password,role} = req.body
            if(!email || !password || !name){
                res.status(StatusCode.BAD_REQUEST)
                .json({
                    success:false,
                    error:"Missing required email or password fields!"
                })
                return
            }

            await this.signUpOtpTool.execute(name,email,password,role)

            res.status(StatusCode.OK).json({
                success:true,
                message:"OTP sent successfully to your email.",
            })
        } catch (error) {
            next(error)
        }
    }

    async handleRegister(req:Request,res:Response,next:NextFunction){
        try {
            const {email,otp} =req.body
            if(!email || !otp){
                res.status(StatusCode.BAD_REQUEST)
                .json({
                    success:false,
                    error:"Email and OTP are required!"
                })
                return
            }
            

            const {accessToken,refreshToken,user} = await this.registerTool.execute(email,otp)

            res.cookie('access_token',accessToken,{
                httpOnly:true,
                secure:false,
                maxAge:15*60*1000
            })
            res.cookie('refresh_token',refreshToken,{
                httpOnly:true,
                secure:false,
                maxAge:2*24*60*60*1000
            })
 

            res.status(StatusCode.CREATED).json({
                success:true,
                message:"User registered to our database succesfully",
                user:user.toJSON(),
                // accessToken:accessToken,
                // refreshToken:refreshToken,
            })
        } catch (error) {
            next(error)
        }
    }


    async handleLogin(req:Request,res:Response,next:NextFunction){
        try {
            const {email,password} =req.body
            if(!email||!password)return res.status(StatusCode.BAD_REQUEST).json({success:false,err:"Missing fields"})
            
            const {accessToken,refreshToken,user} = await this.loginTool.execute(email,password)

            //store in redis not done

            res.cookie('access_token',accessToken,{
                httpOnly:true,
                secure:false, // development phase https is off
                maxAge:15*60*1000 //15 mins
            })

            res.cookie('refresh_token',refreshToken,{
                httpOnly:true,
                secure:false,
                maxAge:2*24*60*60*1000
            })

            res.status(StatusCode.OK).json({
                success:true,
                user:user.toJSON(),
                // accessToken:accessToken,
                // refreshToken:refreshToken
            })
        } catch (error) {
            next(error)
        }
    }


    async handleRefreshToke(req:Request,res:Response,next:NextFunction){
        try {
            // const {refreshToken} = req.body
            const refreshToken = req.cookies.refresh_token
            const {accessToken} = await this.refreshTool.execute(refreshToken)

            res.cookie('access_token',accessToken,{
                httpOnly:true,
                secure:false,  
                maxAge:15*60*1000  
            })

            res.status(StatusCode.OK).json({
                success:true,
                accessToken
            })
        } catch (error) {
            next(error)
        }
    }

    async handleLogout(req:Request,res:Response,next:NextFunction){
        try {
            const refreshToken = req.cookies.refresh_token

            if(refreshToken){ 
                //redis clear req.user
                try { 
                    const decoded = this.tokenTool.decodeToken(refreshToken)
                    if(decoded && typeof decoded ==='object' && 'userId' in decoded) 
                            await redisClient.del(`refresh_token:${decoded.userId}`)
                } catch (error) {
                   
                }
            }
            res.clearCookie('access_token')
            res.clearCookie('refresh_token')
            res.status(StatusCode.OK).json({
                success:true,
                message:'Logged out successfully'
            })
        } catch (error) {
            next(error)
        }
    }

    async handleGetMe(req:Request,res:Response,next:NextFunction){
        try {
            const userId = req.user?.userId
            if(!userId)return res.status(StatusCode.UNAUTHORIZED)
                .json({success:false,message:'Unauthorized'})

            const user = await this.getMeTool.execute(userId)
            console.log(userId,user.getId())
            res.status(StatusCode.OK).json({
                success:true,
                user:user.toJSON()
            })
        } catch (error) {
            next(error)
        }
    }

    async handleForgotPassword(req:Request,res:Response,next:NextFunction){
        try{
            const {email } = req.body
            if(!email ){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    error:"Missing required email field!"
                })
            }
            
            await this.forgotPasswordTool.execute(email)

            res.status(StatusCode.OK).json({
                success:true,
                message:"OTP sent to your email address"
            })

            
        }
        catch (error) {
            next(error)
        }
    }
    async handleResetPassword(req:Request,res:Response,next:NextFunction){
        try{
            const {email ,otp,newPassword} = req.body
            if(!email || !otp || !newPassword){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    error:"Missing required fields!"
                })                
            }

            await this.resetPasswordTool.execute(email,otp,newPassword)

            res.status(StatusCode.OK).json({
                success:true,
                message:"Password reset successful. Please login with your new password"
            })
        }
        catch (error) {
            next(error)
        }
    }

    async handleGoogleLogin(req:Request,res:Response,next:NextFunction){
        try {
            const {token,role} =req.body
            if(!token || !role){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    error:"Missing Token or Role!"
                })  
            }

            const {accessToken,refreshToken,user} = await this.googleServiceTool.execute({token,role})

            res.cookie('access_token',accessToken,{
                httpOnly:true,
                secure:false, // development phase https is off
                maxAge:15*60*1000 //15 mins
            })

            res.cookie('refresh_token',refreshToken,{
                httpOnly:true,
                secure:false,
                maxAge:2*24*60*60*1000
            })

            res.status(StatusCode.OK).json({
                success:true,
                user:user.toJSON(),
                // accessToken:accessToken,
                // refreshToken:refreshToken
            })
        } catch (error) {
            next(error)
        }
    }

}