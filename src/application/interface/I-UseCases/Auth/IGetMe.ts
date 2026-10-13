import { User } from "../../../../domain/entities/User";
import { GetMeRequestDTO } from "../../../dtos/Auth/GetMe.dto";
 

export interface IGetMe{
    execute(dto: GetMeRequestDTO):Promise<User>
}