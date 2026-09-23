import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { IVectorSearchService } from "../../../infrastructure/Interface/IVectorSearchService.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IDeleteUserUseCase{
    execute(userId: string,adminId: string): Promise<void>
}


export class DeleteUserUseCase implements IDeleteUserUseCase{
    constructor(
        private userRepo:IUserRepository,
        private jobRepo:IJobRepository,
        private vectorSearchService:IVectorSearchService

    ){}

    async execute(userId:string,adminId:string){
        const user = await this.userRepo.findById(userId)
        if(!user){
            throw new AppError(
                'User not found',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        const adminUser = await this.userRepo.findById(adminId)
        if(!adminId && adminUser?.getRole() !=='ADMIN'){
            throw new AppError(
                'Unauthorised access of user management/delete.',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        if(user.getRole()==='COMPANY'){
            const companyJobs = await this.jobRepo.findbyCompanyId(userId)
            const jobIds = companyJobs.map(j=>j.id)
            
            if(jobIds.length>0){
                await this.vectorSearchService.deleteJobEmbeddingsbyJobIds(jobIds)
            }
        }

        await this.userRepo.deleteUser(userId)
    }
}