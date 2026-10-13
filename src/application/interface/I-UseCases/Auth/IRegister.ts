import { User } from "../../../../domain/entities/User";
import { RegisterRequestDTO } from "../../../dtos/Auth/register.dto";

 
export interface IRegisterUser{
    execute(dto:RegisterRequestDTO): Promise<{
        message: string;
        requiresApproval: boolean;
        user: User;
        accessToken?: never;
        refreshToken?: never;
    }|{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>
}