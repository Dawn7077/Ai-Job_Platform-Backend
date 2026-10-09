import { UserStatus } from "@prisma/client";

export interface IUpdateUserStatusUC{
    execute(userId: string, status: UserStatus, adminId: string): Promise<{
    success: boolean;
    message: string;
}>
}