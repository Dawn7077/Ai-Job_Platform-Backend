import { Application, ApplicationStage } from "../../../domain/entities/Application.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IUpdateApplicationStageUseCase{
    execute(companyId: string, applicationId: string, stage: ApplicationStage): Promise<Application>
}

export class UpdateApplicationStageUseCase{
    constructor(
        private applicationRepo:IApplicationRepository,
        private jobRepo:IJobRepository
    ){}

    async execute(companyId:string,applicationId:string,stage:ApplicationStage){

        const application  = await this.applicationRepo.findById(applicationId)
        if(!application){
            throw new AppError(
                'This applications dose not exist',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        const job = await this.jobRepo.findById(application.jobId)
        if(!job){
            throw new AppError(
                'This Job Posting dose not exist',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        if(job.companyId !== companyId){
            throw new AppError(
                'Unauthorized to update this application.',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        return await this.applicationRepo.updateApplication(applicationId,stage) // returns the udpated application
    }
}