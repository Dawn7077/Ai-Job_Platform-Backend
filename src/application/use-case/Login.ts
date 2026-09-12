import { User } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"; 
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { IHashService } from "../../infrastructure/Interface/IHashService.js";
import { ILogin } from "../interface/ILogin.js";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { ICacheService } from "../../infrastructure/db/redisClient.js";
import { RefreshExpiry } from "../../shared/constants/roles.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";

export class LoginUseCase implements ILogin{
    constructor(
        private UserRepo:IUserRepository,
        private HashService:IHashService,
        private TokenService:ITokenService,
        private redisClient:ICacheService
    ){}

    async execute(email: string,password:string): Promise<{ accessToken: string; refreshToken: string; user:User}> {
        if(!email || ! password){ 
            throw new AppError(
                AuthMessages.MISSING_EMAIL_PASSWORD,
                StatusCode.BAD_REQUEST,
                'EMAIL_AND_PASSWORD_MISSING'
            )
        }

        const user = await this.UserRepo.findByEmail(email)
        
        if(!user)throw new AppError(
                AuthMessages.INVALID_CREDENTIALS,
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )
            
        const validPassword = await this.HashService.compare(password,user.getPasswordHash())
        
        if(!validPassword)throw new AppError(
                AuthMessages.INVALID_CREDENTIALS,
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )
        
        if(user.getRole()==='COMPANY' && user.getStatus() !== 'ACTIVE'){
            const status  =  user.getStatus() 
            const message = status === 'PENDING'
            ?AuthMessages.COMPANY_PENDING
            :AuthMessages.COMPANY_SUSPENDED

            throw new AppError(
                message,
                StatusCode.FORBIDDEN,
                'ACCOUNT_NOT_ACTIVE'
            )
        }

        const accessToken =  this.TokenService.generateAccesToken({userId:user.getId(), role:user.getRole()})
        const refreshToken = this.TokenService.generateRefreshToken({userId:user.getId(), role:user.getRole()})
        
        const refreshTokenKey = `refresh_token:${user.getId()}`
        // await this.redisClient.set(refreshTokenKey,refreshToken,'EX',2*24*60*60)
        await this.redisClient.set(refreshTokenKey,refreshToken,RefreshExpiry)
        
        // console.log('redis-stored->',await this.redisClient.get(refreshTokenKey))
        
        return {accessToken,refreshToken,user}
        
    }
}