import { User } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { AppError } from "../../shared/AppErrors.js";
import { AdminMessages } from "../../shared/constants/adminMessages.js";
import { StatusCode } from "../../shared/StatusCode.js";

export interface IVerifyCompany{
    execute(userId: string, status: "ACTIVE" | "SUSPENDED"): Promise<{
        success: boolean;
        message: string;
    }>
}

export class VerifyCompanyUseCase implements IVerifyCompany{
    constructor(private userRepo:IUserRepository){}

    async execute(userId:string, status:'ACTIVE'|'SUSPENDED'){
        const user = await this.userRepo.findById(userId)
        if(!user){
            throw new AppError(
                AdminMessages.COMPANY_NOT_FOUND,
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        if(user?.getRole() !== 'COMPANY'){
            throw new AppError(
                AdminMessages.INVALID_ROLE,
                StatusCode.BAD_REQUEST,
                'INVALID_ROLE'
            )
        }

        await this.userRepo.updateUser(user.getId(),{status:status})

        return {
            success:true,
            message:AdminMessages.STATUS_UPDATE(status)
        }
    }
}