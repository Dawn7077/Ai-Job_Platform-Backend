import { IUserRepository } from "../../../domain/repositories/i-user.repository.js";
import {IEmailService} from "../../interface/services/i-email.service.js"
import { AppError } from "../../../shared/utils/app-errors.util.js";
import { StatusCode } from "../../../shared/constants/status-code.constant.js";
import { generateOtp } from '../../../shared/utils/generate-otp.util.js'
import redisClient, { ICacheService } from '../../../infrastructure/db/Redis/redis-client.db.js'
import { ExpiryOTP } from "../../../shared/constants/roles.constant.js";
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES.js'
import { IForgotPasswordUseCase } from "../../interface/use-cases/Auth/i-forgot-password.use-case.js";  
import { ForgotPasswordRequestDTO } from "../../dtos/Auth/forgot-password.dto.js";




@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase{
    constructor(
        @inject(TYPES.IUserRepository) private userRepo:IUserRepository,
        @inject(TYPES.IEmailService) private EmailService:IEmailService,
        @inject(TYPES.IRedisService) private RedisService:ICacheService,
    ){}

    async execute(dto:ForgotPasswordRequestDTO):Promise<void>{
        const {email} = dto
        const user = await this.userRepo.findByEmail(email)
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