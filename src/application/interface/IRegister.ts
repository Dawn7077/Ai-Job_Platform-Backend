import { User, UserRole } from "../../domain/entities/User.js"
export interface IRegisterUser{
    execute(email: string, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: User;
    }>
}