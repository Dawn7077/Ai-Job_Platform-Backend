import { User } from "../../../../domain/entities/user.entity";
import { GetMeRequestDTO } from "../../../dtos/Auth/get-me.dto";
 

export interface IGetMe{
    execute(dto: GetMeRequestDTO):Promise<User>
}