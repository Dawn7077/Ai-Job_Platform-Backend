import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";

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