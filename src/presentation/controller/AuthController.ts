import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../shared/StatusCode.js";
import { IRegisterUser } from "../../application/interface/IRegister.js";
import { ILogin } from "../../application/interface/ILogin.js";
import { IRefreshToken } from "../../infrastructure/Interface/IRefreshToken.js";
import redisClient from "../../infrastructure/db/redisClient.js";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { IGetMe } from "../../application/interface/IGetMe.js";
import { IForgotPasswordUseCase } from "../../application/use-case/ForgotPassWord.js";
import { IResetPasswordUseCase } from "../../application/use-case/ResetPassword.js";
import { ISignUpOTP } from "../../application/use-case/SignUpOTP.js";
import { IGoogleService } from "../../application/use-case/GoogleLoginUseCase.js";
import { User } from "../../domain/entities/User.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";

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
                    error:AuthMessages.MISSING_EMAIL_PASSWORD
                })
                return
            }

            await this.signUpOtpTool.execute(name,email,password,role)

            res.status(StatusCode.OK).json({
                success:true,
                message:AuthMessages.OTP_SENT,
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
                    error:AuthMessages.MISSING_OTP_EMAIL
                })
                return
            }
            

            const result = await this.registerTool.execute(email,otp)

            if('requiresApproval' in result && result.requiresApproval){
                return res.status(StatusCode.CREATED).json({
                    success:true,
                    message:result.message,
                    requiresApproval:true,
                    user:result.user.toJSON()
                })
            }

            res.cookie('access_token',result.accessToken,{
                httpOnly:true,
                secure:false,
                maxAge:15*60*1000
            })
            res.cookie('refresh_token',result.refreshToken,{
                httpOnly:true,
                secure:false,
                maxAge:2*24*60*60*1000
            })
 

            res.status(StatusCode.CREATED).json({
                success:true,
                message:AuthMessages.REGISTER_SUCCESS,
                user:result.user.toJSON(),
            })
        } catch (error) {
            next(error)
        }
    }


    async handleLogin(req:Request,res:Response,next:NextFunction){
        try {
            const {email,password} =req.body
            if(!email||!password)return res.status(StatusCode.BAD_REQUEST).json({success:false,err:AuthMessages.MISSING_EMAIL_PASSWORD})
            
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
                message:AuthMessages.LOGOUT_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    async handleGetMe(req:Request,res:Response,next:NextFunction){
        try {
            const userId = req.user?.userId
            if(!userId)return res.status(StatusCode.UNAUTHORIZED)
                .json({success:false,message:AuthMessages.UNAUTHORIZED})

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
                    error:AuthMessages.MISSING_EMAIL
                })
            }
            
            await this.forgotPasswordTool.execute(email)

            res.status(StatusCode.OK).json({
                success:true,
                message:AuthMessages.OTP_SENT
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
                    error:AuthMessages.MISSING_FEILDS
                })                
            }

            await this.resetPasswordTool.execute(email,otp,newPassword)

            res.status(StatusCode.OK).json({
                success:true,
                message:AuthMessages.RESET_SUCCESS
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
                    error:AuthMessages.MISSING_TOKEN_ROLE
                })  
            }

            const result = await this.googleServiceTool.execute({token,role})

            if('requiresApproval' in  result && result.requiresApproval){
                return res.status(StatusCode.CREATED).json({
                    success:true,
                    message:result.message,
                    requiresApproval:true,
                    user:result.user.toJSON()
                })
            } 

            // const successRes = result as {accessToken:string,refreshToken:string,user:User}
            const {accessToken,refreshToken,user} = result as {accessToken:string,refreshToken:string,user:User}

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