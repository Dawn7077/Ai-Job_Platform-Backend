import { User } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import redisClient from "../../infrastructure/db/redisClient.js";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { IHashService } from "../../infrastructure/repo/IHashService.js";
import { ILogin } from "../interface/ILogin.js";
import { ITokenService } from "../../infrastructure/repo/ITokenService.js";

export class LoginUseCase implements ILogin{
    constructor(
        private SQLTool:IUserRepository,
        private Hash:IHashService,
        private TokenTool:ITokenService
    ){}

    async execute(email: string,password:string): Promise<{ accessToken: string; refreshToken: string; user:User}> {
        if(!email || ! password){
            // throw new Error("Email and password missing")
            throw new AppError(
                "Email and password missing",
                StatusCode.BAD_REQUEST,
                'EMAIL AND PASSWORD MISSING'
            )
        }

        const user = await this.SQLTool.findByEmail(email)
        
        if(!user)throw new AppError(
                'Invalid email or password credentials',
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )
            
        const validPassword = await this.Hash.compare(password,user.getPasswordHash())
        
        if(!validPassword)throw new AppError(
                'Invalid email or password credentials',
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )
        
        const accessToken =  this.TokenTool.generateAccesToken({userId:user.getId(), role:user.getRole()})
        const refreshToken = this.TokenTool.generateRefreshToken({userId:user.getId(), role:user.getRole()})
        
        const refreshTokenKey = `refresh_token:${user.getId()}`
        await redisClient.set(refreshTokenKey,refreshToken,'EX',2*24*60*60)
        
        return {accessToken,refreshToken,user}
        
    }
}