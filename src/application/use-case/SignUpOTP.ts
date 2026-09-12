import { UserRole } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IEmailService } from "../../infrastructure/Interface/IEmailService.js";
import { IHashService } from "../../infrastructure/Interface/IHashService.js";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { generateOtp } from "../../shared/utils.js";
import redisClient, { ICacheService } from "../../infrastructure/db/redisClient.js";
import { ResetOTPExpiry, SignUpOTPExpiry } from "../../shared/constants/roles.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";

export interface ISignUpOTP{
    execute(name: string, email: string, password: string, role:UserRole): Promise<{
    email: string;
}>
}

export class SendSignUpOTPUseCase implements ISignUpOTP{
    constructor(
        private SQLTool:IUserRepository,
        private EmailService:IEmailService,
        private HashService:IHashService,
        private RedisTool:ICacheService,
    ){}

    async execute(name:string,email:string,password:string,role:UserRole,){
        const existingUser = await this.SQLTool.findByEmail(email)
        
        if(existingUser){
            throw new AppError(
                AuthMessages.USER_EXISTS,
                StatusCode.BAD_REQUEST,
                'REGISTRATION_ERROR'
            )
        }
        // timer check for otp cooldown if its already created
        const cooldownKey = `otp_cooldown:${email}`
        // const ttl = await redisClient.ttl(cooldownKey)
        const ttl = await this.RedisTool.ttl(cooldownKey)

        if(ttl>0){
            throw new AppError(
                AuthMessages.COOLDOWN_TTL(ttl),
                StatusCode.TOO_MANY_REQUEST,
                'OTP_COOLDOWN_ACTIVE'
            )
        }

        const passwordHash = await this.HashService.hash(password)
        const otp = generateOtp()
        console.log('otp',otp)
        const SignUpData = JSON.stringify({name,email,passwordHash,role,otp})

        // await redisClient.set(`signup_otp:${email}`,SignUpData,'EX',600)
        // await redisClient.set(cooldownKey,'true','EX',60)

        await this.RedisTool.set(`signup_otp:${email}`,SignUpData,SignUpOTPExpiry)
        await this.RedisTool.set(cooldownKey,'true',ResetOTPExpiry)

        await this.EmailService.sendOtpEmail(email,otp,AuthMessages.EMAIL_VERIFY_MSG)
        return {email}
    }
}