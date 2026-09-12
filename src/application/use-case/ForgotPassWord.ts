import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import {IEmailService} from "../../infrastructure/Interface/IEmailService.js"
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { generateOtp } from '../../shared/utils.js'
import redisClient, { ICacheService } from '../../infrastructure/db/redisClient.js'
import { ExpiryOTP } from "../../shared/constants/roles.js";


export interface IForgotPasswordUseCase{
    execute(email:string):Promise<void>
}
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        private SQLTool:IUserRepository, 
        private EmailService:IEmailService,
        private RedisService:ICacheService,
    ){}

    async execute(email:string):Promise<void>{
        const user = await this.SQLTool.findByEmail(email)
        if(!user)
            throw new AppError(
                "User not found",
                StatusCode.NOT_FOUND,
                'USER NOT FOUND'
            )
        
        const otp  = generateOtp() 
        const otpKey = `otp:${user.getId()}`
        
        const cooldownKey = `otp_cooldown:${email}`
        const ttl = await this.RedisService.ttl(cooldownKey)

        if(ttl>0){
            throw new AppError(
                `Please wait ${ttl} seconds before requesting a new OTP`,
                StatusCode.TOO_MANY_REQUEST,
                'OTP_COOLDOWN_ACTIVE'
            )
        }

        await this.RedisService.set(otpKey,otp,ExpiryOTP)
        await this.RedisService.set(cooldownKey,'true',60)

        await this.EmailService.sendOtpEmail(email,otp,'Password Reset OTP')

    }
}