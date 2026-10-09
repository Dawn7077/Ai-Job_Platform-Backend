import { inject, injectable } from "inversify";
import { UserRole } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { TYPES } from "../../../di/TYPES"; 
import { IUpdateUserRoleUC } from "../../interface/I-UseCases/Admin/IUpdateUserRoleUC";


@injectable()
export class UpdateUserRoleUC implements IUpdateUserRoleUC{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute(userId:string,role:UserRole,adminId:string){

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

        await this.userRepo.updateUser(userId,{role})

        return {
            success:true,
            message:`User Role has been updated to ${role}`
        }

    }
}