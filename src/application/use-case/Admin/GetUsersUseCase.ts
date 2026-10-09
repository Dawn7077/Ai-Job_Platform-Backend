import { IUserRepository, UserFilterQueryParams } from "../../../domain/repositories/IUserRepository";
import { UserStatus,UserRole } from "../../../domain/entities/User";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/TYPES"; 
import { IGetUsersUseCase } from "../../interface/I-UseCases/Admin/IGetUsersUseCase";



@injectable()
export class GetUsersUseCase implements IGetUsersUseCase{
    constructor(@inject(TYPES.IUserRepository) private userRepo:IUserRepository){}

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