import { UserRole } from "@prisma/client";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IEmailService } from "../../infrastructure/repo/IEmailService.js";
import { IHashService } from "../../infrastructure/repo/IHashService.js";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { generateOtp } from "../../shared/utils.js";
import redisClient from "../../infrastructure/db/redisClient.js";

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
    ){}

    async execute(name:string,email:string,password:string,role:UserRole,){
        const existingUser = await this.SQLTool.findByEmail(email)
        
        if(existingUser){
            throw new AppError(
                "Already existing user",
                StatusCode.BAD_REQUEST,
                'REGISTRATION_ERROR'
            )
        }
        // timer check for otp cooldown if its already created
        const cooldownKey = `otp_cooldown:${email}`
        const ttl = await redisClient.ttl(cooldownKey)

        if(ttl>0){
            throw new AppError(
                `Please wait ${ttl} seconds before requesting a new OTP`,
                StatusCode.TOO_MANY_REQUEST,
                'OTP_COOLDOWN_ACTIVE'
            )
        }

        const passwordHash = await this.HashService.hash(password)
        const otp = generateOtp()
        const SignUpData = JSON.stringify({name,email,passwordHash,role,otp})
        await redisClient.set(`signup_otp:${email}`,SignUpData,'EX',600)
        await redisClient.set(cooldownKey,'true','EX',60)

        await this.EmailService.sendOtpEmail(email,otp,'Verify your email for account sign-up')
        return {email}
    }
}