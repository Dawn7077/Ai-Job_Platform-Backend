import { LoginRequestDTO, LoginResponseDTO } from "../../../dtos/Auth/login.dto"
import { User } from "../../../../domain/entities/user.entity"  

export interface ILogin{
    execute(dto:LoginRequestDTO):Promise<LoginResponseDTO>
}