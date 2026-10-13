import { inject, injectable } from "inversify"
import { User } from "../../../domain/entities/user.entity"
import { IUserRepository } from "../../../domain/repositories/i-user.repository" 
import { TYPES } from "../../../di/TYPES"
import { IGetPendingUsers } from "../../interface/use-cases/Admin/i-get-pending-users.use-case"


@injectable()
export class GetPendingUsersUseCase implements IGetPendingUsers{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute():Promise<User[]>{
        const users = await this.userRepo.findPendingUsers()
        return users
    }
}