import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/i-user.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetMe } from "../../interface/use-cases/Auth/i-get-me.use-case";   
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'
import { GetMeRequestDTO } from "../../dtos/Auth/get-me.dto";

@injectable()
export class GetMeUseCase implements IGetMe{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

    async execute(dto: GetMeRequestDTO): Promise<User> {
        const {userId} = dto
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