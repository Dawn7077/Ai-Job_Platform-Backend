import { UserStatus } from "../../../domain/entities/User.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IUpdateUserStatusUC{
    execute(userId: string, status: UserStatus, adminId: string): Promise<{
    success: boolean;
    message: string;
}>
}
export class UpdateUserStatusUC implements IUpdateUserStatusUC{
    constructor(private userRepo:IUserRepository){}
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