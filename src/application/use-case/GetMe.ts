import { User } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { IGetMe } from "../interface/IGetMe.js";


export class GetMeUseCase implements IGetMe{
    constructor(private SQLTool:IUserRepository){}

    async execute(userId: string): Promise<User> {
        if(!userId){
            throw new AppError(
            'User Id missing',
            StatusCode.BAD_REQUEST,
            'User_Id_MISSING'
            )
        }

        const user = await this.SQLTool.findById(userId)

        if(!user){
            throw new AppError(
                'User not fount',
                StatusCode.BAD_REQUEST,
                'USER_NOT_FOUND'
            )
        }

        return user
    }
}