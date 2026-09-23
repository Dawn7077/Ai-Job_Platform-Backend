import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { IVectorSearchService } from "../../../infrastructure/Interface/IVectorSearchService.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IDeleteJobUseCase{
    execute(jobId: string, companyId: string): Promise<void>
}

export class DeleteJobUseCase{
    constructor(
        private userRepo:IUserRepository,
        private jobRepo:IJobRepository,
        private vectorService:IVectorSearchService
    ){}

    async execute(jobId:string,companyId:string){
        const user = await this.userRepo.findById(companyId)
        if(!user || user.getRole()!=='COMPANY'){
            throw new AppError(
                'Unauthorized to delete any jobs',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        await this.jobRepo.deleteJob(jobId)
        await this.vectorService.deleteJobEmbedding(jobId)
    }
}