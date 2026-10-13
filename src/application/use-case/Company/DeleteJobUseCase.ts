import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/TYPES";

export interface IDeleteJobUseCase{
    execute(jobId: string, companyId: string): Promise<void>
}

@injectable()
export class DeleteJobUseCase{
    constructor(
        @inject(TYPES.IUserRepository) private userRepo:IUserRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
        @inject(TYPES.IVectorSearchService) private vectorService:IVectorSearchService
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