import {inject,injectable}from 'inversify'
import {TYPES} from '../../../di/TYPES'
import { IUserRepository } from "../../../domain/repositories/i-user.repository";
import { IHashService } from "../../interface/services/i-hash.service"
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import redisClient, { ICacheService } from '../../../infrastructure/db/Redis/redis-client.db'
import { AuthMessages } from "../../../shared/constants/auth-messages.constant";
import { IResetPasswordUseCase } from '../../interface/use-cases/Auth/i-reset-password.use-case'; 
import { ResetPasswordRequestDTO } from '../../dtos/Auth/reset-password.dto';



@injectable()
export class ResetPassswordUseCase  implements IResetPasswordUseCase{
    constructor(
        @inject(TYPES.IUserRepository) private SQLTool:IUserRepository,
        @inject(TYPES.IHashService) private HashTool:IHashService,
        @inject(TYPES.IRedisService) private RedisTool:ICacheService,
    ){}

    async execute (dto:ResetPasswordRequestDTO): Promise <void> {
        const {email,otp,newPassword} = dto
        
        const user = await this.SQLTool.findByEmail(email)
        if(!user)
            throw new AppError(
                AuthMessages.USER_NOT_FOUND,
                StatusCode.NOT_FOUND,
                'USER NOT FOUND'
            )
        
        const otpKey = `otp:${user.getId()}`
        // const storedOtp = await redisClient.get(otpKey)
        const storedOtp = await this.RedisTool.get(otpKey)

        if(!storedOtp || storedOtp !== otp){
            throw new AppError(
                AuthMessages.INVALID_OTP,
                StatusCode.BAD_REQUEST,
                'INVALID_OTP'
            )
        }

        const newPasswordHash = await this.HashTool.hash(newPassword)
        await this.SQLTool.updateUser(user.getId(),{passwordHash:newPasswordHash})

        console.log('redis-(resetpass)stored->',await this.RedisTool.get(otpKey))
        
        // await redisClient.del(otpKey)
        await this.RedisTool.del(otpKey)
    }
}
