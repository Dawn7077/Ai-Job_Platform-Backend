import { User } from "../../domain/entities/User.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"

export interface IGetPendingUsers{
    execute(): Promise<User[]>
}

export class GetPendingUsersUseCase implements IGetPendingUsers{
    constructor(private userRepo:IUserRepository){}

    async execute():Promise<User[]>{
        const users = await this.userRepo.findPendingUsers()
        return users
    }
}