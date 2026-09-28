import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IReapplyVerificationUseCase{
    execute(userId: string): Promise<{
        success: boolean;
        message: string;
    }>
}

export class ReapplyVerificationUseCase implements IReapplyVerificationUseCase{
    constructor(private userRepo:IUserRepository){}

    async execute(email:string){
        const user = await this.userRepo.findByEmail(email)
        if(!user){
            throw new AppError(
                'User dose not exits',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        if(user.getRole() !=='COMPANY' || user.getStatus()==="ACTIVE"){
            throw new AppError(
                'Invalid account state for reapplication',
                StatusCode.BAD_REQUEST,
                'INVALID_STATE'
            )
        }
        
        await this.userRepo.updateUser(user.getId(),{
            status:'PENDING'
        })

        return {
            success:true,
            message:"Your re-application has been submitted for admin review."
        }
         
    }
}