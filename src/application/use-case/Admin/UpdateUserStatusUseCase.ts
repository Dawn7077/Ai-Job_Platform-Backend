import { inject, injectable } from "inversify";
import { UserStatus } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IUpdateUserStatusUC } from "../../interface/I-UseCases/Admin/IUpdateUserStatusUC";  
import { TYPES } from "../../../di/TYPES";

@injectable()
export class UpdateUserStatusUC implements IUpdateUserStatusUC{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}
    async execute(userId:string,status:UserStatus,adminId:string){
        if(userId===adminId){
            throw new AppError(
                'You cannot modify your own active admin account',
                StatusCode.BAD_REQUEST,
                "SELF_MODIFICATION_DISALLOWED"
            )
        }

        const user = await this.userRepo.findById(userId)
        if(!user){
            throw new AppError(
                'User Not Found.',
                StatusCode.NOT_FOUND,
                "NOT_FOUND"
            )
        }

        await this.userRepo.updateUser(userId,{status})
        return {
            success:true,
            message:`User Status has been updated to ${status}`
        }
    }
}