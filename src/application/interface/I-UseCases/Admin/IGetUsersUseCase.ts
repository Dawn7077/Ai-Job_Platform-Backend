import { UserRole, UserStatus } from "../../../../domain/entities/User";
import { GetUsersQueryDTO } from "../../../dtos/Admin/getUsers.dto";

export interface IGetUsersUseCase{
    execute(query:GetUsersQueryDTO): Promise<{
    users: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date | undefined;
    }[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
}>
}