import {inject,injectable}from 'inversify'
import {TYPES} from '../../../di/TYPES'
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../interface/I-Services/IHashService"
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import redisClient, { ICacheService } from '../../../infrastructure/db/Redis/redisClient'
import { AuthMessages } from "../../../shared/constants/authMessages";
import { IResetPasswordUseCase } from '../../interface/I-UseCases/Auth/IResetPasswordUseCase'; 



@injectable()
export class ResetPassswordUseCase  implements IResetPasswordUseCase{
    constructor(
        @inject(TYPES.IUserRepository) private SQLTool:IUserRepository,
        @inject(TYPES.IHashService) private HashTool:IHashService,
        @inject(TYPES.IRedisService) private RedisTool:ICacheService,
    ){}

    async execute (email:string,otp:string,newPassword:string): Promise <void> {
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
