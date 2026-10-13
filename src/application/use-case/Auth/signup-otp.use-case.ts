import { UserRole } from "@prisma/client";
import { IUserRepository } from "../../../domain/repositories/i-user.repository";
import { IEmailService } from "../../interface/services/i-email.service";
import { IHashService } from "../../interface/services/i-hash.service";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { generateOtp } from "../../../shared/utils/generate-otp.util";
import redisClient, { ICacheService } from "../../../infrastructure/db/Redis/redis-client.db";
import { ResetOTPExpiry, SignUpOTPExpiry } from "../../../shared/constants/roles.constant";
import { AuthMessages } from "../../../shared/constants/auth-messages.constant";
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'
import { ISignUpOTP } from "../../interface/use-cases/Auth/i-signup-otp.use-case"; 
import { SendSignUpOTPRequestDTO, SendSignUpOTPResponseDTO } from "../../dtos/Auth/signup.dto";





@injectable()
export class SendSignUpOTPUseCase implements ISignUpOTP{
    constructor(
        
        @inject(TYPES.IUserRepository) private SQLTool:IUserRepository,
        @inject(TYPES.IEmailService) private EmailService:IEmailService,
        @inject(TYPES.IHashService)private HashService:IHashService,
        @inject(TYPES.IRedisService)private RedisTool:ICacheService,
    ){}

    async execute(dto:SendSignUpOTPRequestDTO):Promise<SendSignUpOTPResponseDTO>{
        const {name,email,password,role}= dto
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