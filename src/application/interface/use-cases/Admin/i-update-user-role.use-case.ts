import { UserRole } from "../../../../domain/entities/user.entity";

 
export interface IUpdateUserRoleUC{
    execute(userId: string, role: UserRole, adminId: string): Promise<{
        success: boolean;
        message: string;
    }>
}