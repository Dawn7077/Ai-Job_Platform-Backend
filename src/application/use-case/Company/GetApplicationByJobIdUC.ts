import { Application, ApplicationStage } from "../../../domain/entities/Application.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetApplicationByJobIdUC{
    execute(companyId: string, jobId: string, status?: ApplicationStage | undefined): Promise<Application[]>
}

export class GetApplicationByJobIdUC implements IGetApplicationByJobIdUC{
    constructor(
        private applicationRepo:IApplicationRepository,
        private userRepo:IUserRepository,
        private jobRepo:IJobRepository,
    ){}

    async execute(companyId:string,jobId:string,status?:ApplicationStage){
        const company = await this.userRepo.findById(companyId)
        if(!company){
            throw new AppError(
                'Unauthorized to delete any jobs',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }
        const job = await this.jobRepo.findById(jobId)
        if(!job){
            throw new AppError(
                'Did not find any jobs posting from the provided job id ',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        return await this.applicationRepo.findByJobId(jobId,status)
    }
}