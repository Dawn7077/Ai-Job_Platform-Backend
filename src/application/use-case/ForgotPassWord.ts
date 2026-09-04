import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import {IEmailService} from "../../infrastructure/repo/IEmailService.js"
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { generateOtp } from '../../shared/utils.js'
import redisClient from '../../infrastructure/db/redisClient.js'


export interface IForgotPasswordUseCase{
    execute(email:string):Promise<void>
}
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        private SQLTool:IUserRepository, 
        private EmailService:IEmailService,
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
        const expiry = 600
        const otpKey = `otp:${user.getId()}`
        
        const cooldownKey = `otp_cooldown:${email}`
        const ttl = await redisClient.ttl(cooldownKey)

        if(ttl>0){
            throw new AppError(
                `Please wait ${ttl} seconds before requesting a new OTP`,
                StatusCode.TOO_MANY_REQUEST,
                'OTP_COOLDOWN_ACTIVE'
            )
        }

        await redisClient.set(otpKey,otp,'EX',expiry)
        await redisClient.set(cooldownKey,'true','EX',60)

        await this.EmailService.sendOtpEmail(email,otp,'Password Reset OTP')

    }
}