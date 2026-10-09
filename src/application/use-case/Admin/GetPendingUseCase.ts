import { inject, injectable } from "inversify"
import { User } from "../../../domain/entities/User"
import { IUserRepository } from "../../../domain/repositories/IUserRepository" 
import { TYPES } from "../../../di/TYPES"
import { IGetPendingUsers } from "../../interface/I-UseCases/Admin/IGetPendingUsers"


@injectable()
export class GetPendingUsersUseCase implements IGetPendingUsers{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute():Promise<User[]>{
        const users = await this.userRepo.findPendingUsers()
        return users
    }
}