import { UserRole, UserStatus } from "../../../domain/entities/User";

export interface IGetUsersUseCase{
    execute(query: {
    page?: string | undefined;
    limit?: string | undefined;
    role?: string | undefined;
    status?: string | undefined;
    search?: string | undefined;
}): Promise<{
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