import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository"; 
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IHashService } from "../../interface/I-Services/IHashService";
import { ILogin } from "../../interface/I-UseCases/Auth/ILogin";    
import { ITokenService } from "../../interface/I-Services/ITokenService";
import { ICacheService } from "../../../infrastructure/db/Redis/redisClient";
import { RefreshExpiry } from "../../../shared/constants/roles";
import { AuthMessages } from "../../../shared/constants/authMessages";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import {logger} from "../../../shared/utils/loggers"
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'

@injectable()
export class LoginUseCase implements ILogin{
    constructor(
        @inject(TYPES.IUserRepository) private UserRepo:IUserRepository,
        @inject(TYPES.ICandidateProfileRepo) private candidateRepo:ICandidateProfileRepository,
        @inject(TYPES.IHashService)private HashService:IHashService,
        @inject(TYPES.ITokenService)private TokenService:ITokenService,
        @inject(TYPES.IRedisService)private redisClient:ICacheService
    ){}

    async execute(email: string,password:string): Promise<{ accessToken: string; refreshToken: string; user:User;isOnboarding:boolean}> {
        if(!email || ! password){ 
            logger.warn({event:"login_validation_falied",reason:"missing_email_or_password",email},'Login attempt failed due to Missing credentials')
            throw new AppError(
                AuthMessages.MISSING_EMAIL_PASSWORD,
                StatusCode.BAD_REQUEST,
                'EMAIL_AND_PASSWORD_MISSING'
            )
        }

        const user = await this.UserRepo.findByEmail(email)
        
        if(!user){
            logger.warn({event:"login_falied",reason:"user_not_found",email},'Login attempt failed:User not found')
            throw new AppError(
                AuthMessages.INVALID_CREDENTIALS,
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )
        }
            
        const validPassword = await this.HashService.compare(password,user.getPasswordHash())
        
        if(!validPassword){
            logger.warn({event:"login_falied",reason:"invalid_password",userId:user.getId(),email},'Login attempt failed: Invalid password')
            throw new AppError(
                AuthMessages.INVALID_CREDENTIALS,
                StatusCode.UNAUTHORIZED,
                'INVALID_CREDENTIALS'
            )}
        
        if(user.getRole()==='COMPANY' && user.getStatus() !== 'ACTIVE'){
            const status  =  user.getStatus() 
            const rejectionReason = user.getRejectionReason()
            
            logger.warn({
                event:"company_login_blocked",
                userId:user.getId(),
                reason:status==='PENDING'?'company_pending':'company_suspended',
                status,
                rejectionReason,
            },'Company login Blocked due to inactive status')


            const message = status === 'PENDING'
            ?AuthMessages.COMPANY_PENDING
            :AuthMessages.COMPANY_SUSPENDED(rejectionReason||'')

            throw new AppError(
                message,
                StatusCode.FORBIDDEN,
                'ACCOUNT_NOT_ACTIVE'
            )
        }
        let isOnboarding = false

        if(user.getRole() ==='CANDIDATE'){
            const candidateProfile = await this.candidateRepo.findByUserId(user.getId())
            isOnboarding = candidateProfile !== null //if no profile candidate profile ==null is onboarding turn true and leads to onboarding page
        }

        const accessToken =  this.TokenService.generateAccesToken({userId:user.getId(), role:user.getRole()})
        const refreshToken = this.TokenService.generateRefreshToken({userId:user.getId(), role:user.getRole()})
        
        const refreshTokenKey = `refresh_token:${user.getId()}`
        // await this.redisClient.set(refreshTokenKey,refreshToken,'EX',2*24*60*60)
        await this.redisClient.set(refreshTokenKey,refreshToken,RefreshExpiry)
        
        // console.log('redis-stored->',await this.redisClient.get(refreshTokenKey))
        
        return {accessToken,refreshToken,user,isOnboarding}
        
    }
}