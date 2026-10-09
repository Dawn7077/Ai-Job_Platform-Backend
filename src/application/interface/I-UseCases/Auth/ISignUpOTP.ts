import { UserRole } from "../../../domain/entities/User";

export interface ISignUpOTP{
    execute(name: string, email: string, password: string, role:UserRole): Promise<{
        email: string;
    }>
}