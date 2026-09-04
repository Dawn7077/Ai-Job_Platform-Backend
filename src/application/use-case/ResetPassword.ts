import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IHashService } from "../../infrastructure/repo/IHashService.js"
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import redisClient from '../../infrastructure/db/redisClient.js'
export interface IResetPasswordUseCase{
    execute(email:string,otp:string,newPassword:string):Promise<void>
}

export class ResetPassswordUseCase  implements IResetPasswordUseCase{
    constructor(
        private SQLTool:IUserRepository,
        private HashTool:IHashService,
    ){}

    async execute (email:string,otp:string,newPassword:string): Promise <void> {
        const user = await this.SQLTool.findByEmail(email)
        if(!user)
            throw new AppError(
                "User not found",
                StatusCode.NOT_FOUND,
                'USER NOT FOUND'
            )
        
        const otpKey = `otp:${user.getId()}`
        const storedOtp = await redisClient.get(otpKey)
        if(!storedOtp || storedOtp !== otp){
            throw new AppError(
                "Invalid OTP code provided.",
                StatusCode.BAD_REQUEST,
                'INVALID OTP'
            )
        }

        const newPasswordHash = await this.HashTool.hash(newPassword)
        await this.SQLTool.updateUser(user.getId(),{passwordHash:newPasswordHash})

        await redisClient.del(otpKey)

    }
}
