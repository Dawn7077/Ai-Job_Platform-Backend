import { User } from "../../../domain/entities/User";  
export interface IRegisterUser{
    execute(email: string, otp: string): Promise<{
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