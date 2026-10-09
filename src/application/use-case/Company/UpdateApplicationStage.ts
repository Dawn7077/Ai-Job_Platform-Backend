import { inject, injectable } from "inversify";
import { Application, ApplicationStage } from "../../../domain/entities/Application";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { TYPES } from "../../../di/TYPES";
import { IUpdateApplicationStageUseCase } from "../../interface/I-UseCases/Company/IUpdateApplicationStageUseCase";
 

@injectable()
export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository
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