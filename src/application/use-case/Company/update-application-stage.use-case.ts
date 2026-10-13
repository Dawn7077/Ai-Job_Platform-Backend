import { inject, injectable } from "inversify";
import { Application, ApplicationStage } from "../../../domain/entities/application.entity";
import { IApplicationRepository } from "../../../domain/repositories/i-application.repository";
import { IJobRepository } from "../../../domain/repositories/i-job.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { TYPES } from "../../../di/TYPES";
import { IUpdateApplicationStageUseCase } from "../../interface/use-cases/Company/i-update-application-stage.use-case";
import { UpdateApplicationParamDTO, UpdateApplicationStageRequestDTO } from "../../dtos/Company/update-application.dto";
 

@injectable()
export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository
    ){}

    async execute(
        companyId:string,
        {id:applicationId}:UpdateApplicationParamDTO,
        {stage}:UpdateApplicationStageRequestDTO
    ){

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