import { IUserRepository, UserFilterQueryParams } from "../../../domain/repositories/IUserRepository.js";
import { UserStatus,UserRole } from "../../../domain/entities/User.js";

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
export class GetUsersUseCase implements IGetUsersUseCase{
    constructor(private userRepo:IUserRepository){}

    async execute(query:
       { page?:string
        limit?:string
        role?:string
        status?:string
        search?:string}
    ){
        const page = Math.max(1,parseInt(query.page || '1',10))
        const limit = Math.max(1,parseInt(query.limit || '10',10))
        
        const params:UserFilterQueryParams={
            page,
            limit,
            role:query.role as UserRole || undefined,
            status:query.status as UserStatus|| undefined,
            search:query.search || undefined        
        }

        const result = await this.userRepo.findUsers(params)

        return {
            users:result.users.map(user=>user.toJSON()),
            pagination:{
                total:result.total,
                page:result.page,
                totalPages:result.totalPages,
                limit
            }
        }
    }
}