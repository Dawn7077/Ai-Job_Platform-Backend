import { Request, Response } from "express";
import { StatusCode } from "../../shared/StatusCode.js";
import { IRegisterUser } from "../../application/interface/IRegister.js";
import { ILogin } from "../../application/interface/ILogin.js";
import { IRefreshToken } from "../../application/interface/IRefreshToken.js";
import redisClient from "../../infrastructure/db/redisClient.js";
import { ITokenService } from "../../application/interface/ITokenService.js";
import { IGetMe } from "../../application/interface/IGetMe.js";

export class AuthController{
    constructor(
        private registerTool:IRegisterUser,
        private loginTool:ILogin,
        private refreshTool:IRefreshToken,
        private tokenTool:ITokenService,
        private getMeTool:IGetMe
    ){}

    async handleRegister(req:Request,res:Response){
        try {
            const {name,email,password,role} = req.body
            if(!email||!password){
                res.status(StatusCode.BAD_REQUEST)
                .json({
                    success:false,
                    error:"Missing required email or password fields!"
                })
                return
            }

            const {accessToken,refreshToken,user} = await this.registerTool.execute(name,email,password,role)

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
            let err = error instanceof Error ? error.message : "AN unexpected error has occured"
            res.status(StatusCode.BAD_REQUEST).json({success:false,error:err})
        }
    }


    async handleLogin(req:Request,res:Response){
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
            let err = error instanceof Error? error.message :"something wrong in handlelogin"
            res.status(StatusCode.BAD_REQUEST).json({success:false,error:err})
        }
    }


    async handleRefreshToke(req:Request,res:Response){
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
            let err = error instanceof Error ? error.message:'Authentication for new accessToken failed'
            res.status(StatusCode.BAD_REQUEST).json({
                success:false,
                message:err
            })
        }
    }

    async handleLogout(req:Request,res:Response){
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
            let err  = error instanceof Error?error.message:'Error during logout'
            res.status(StatusCode.BAD_REQUEST).json({success:false,error:err})
        }
    }

    async handleGetMe(req:Request,res:Response){
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
             let err  = error instanceof Error?error.message:'Error fetching user details'
            res.status(StatusCode.BAD_REQUEST).json({success:false,error:err})
        }
    }

}