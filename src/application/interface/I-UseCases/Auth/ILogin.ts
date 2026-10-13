import { LoginRequestDTO, LoginResponseDTO } from "../../../dtos/Auth/login.dto"
import { User } from "../../../../domain/entities/User"  

export interface ILogin{
    execute(dto:LoginRequestDTO):Promise<LoginResponseDTO>
}