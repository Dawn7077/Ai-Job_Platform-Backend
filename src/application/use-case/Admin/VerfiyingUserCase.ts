import { inject, injectable } from "inversify";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppErrors";
import { AdminMessages } from "../../../shared/constants/adminMessages";
import { StatusCode } from "../../../shared/StatusCode";
import { IVerifyCompany } from "../../interface/I-UseCases/Admin/IVerifyCompany";  
import { TYPES } from "../../../di/TYPES";


@injectable()
export class VerifyCompanyUseCase implements IVerifyCompany{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute(userId:string, status:'ACTIVE'|'SUSPENDED',rejectionReason?:string){
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
        console.log('verifying--->',rejectionReason)
        await this.userRepo.updateUser(user.getId(),{
            status:status,
            rejectionReason:status==='SUSPENDED'?rejectionReason:undefined,
        })

        return {
            success:true,
            message:AdminMessages.STATUS_UPDATE(status)
        }
    }
}