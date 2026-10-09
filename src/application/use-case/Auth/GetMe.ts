import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetMe } from "../../interface/I-UseCases/Auth/IGetMe";   
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'

@injectable()
export class GetMeUseCase implements IGetMe{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute(userId: string): Promise<User> {
        if(!userId){
            throw new AppError(
            'User Id missing',
            StatusCode.BAD_REQUEST,
            'User_Id_MISSING'
            )
        }

        const user = await this.userRepo.findById(userId)

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