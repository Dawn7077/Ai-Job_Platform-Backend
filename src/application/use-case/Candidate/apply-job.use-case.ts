import { inject, injectable } from "inversify"
import { Application } from "../../../domain/entities/application.entity"
import { IApplicationRepository } from "../../../domain/repositories/i-application.repository"
import { IJobRepository } from "../../../domain/repositories/i-job.repository"
import { IVectorSearchService } from "../../interface/services/i-vector-search.service"
import { AppError } from "../../../shared/utils/app-errors.util"
import { StatusCode } from "../../../shared/constants/status-code.constant"
import { IApplyJobUseCase } from "../../interface/use-cases/Candidate/i-apply-job.use-case"
import { TYPES } from "../../../di/TYPES"
import { ApplyJobRequestDTO } from "../../dtos/Candidate/apply-job.dto"

export interface ApplyJobInputDTO{
    candidateId:string
    jobID:string
    resumeUrl?:string
}


@injectable()
export class ApplyJobUseCase implements IApplyJobUseCase{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private JobRepo:IJobRepository, 
    ){}

    async execute(dto:ApplyJobRequestDTO):Promise<Application>{
        const {candidateId,jobID,resumeUrl} = dto
        console.log('applyUsecase Executing ...')
        const job = await this.JobRepo.findById(jobID)
        if(!job){
            throw new AppError(
                'Job dosent exit',
                StatusCode.NOT_FOUND,
                'JOB_NOT_FOUND'
            )
        }
        if(job.status !=='OPEN'){
            throw new AppError(
                'This Job is no longer accepting applications',
                StatusCode.BAD_REQUEST,
                'JOB_CLOSED'
            )
        }

        const existingApplication = await this.applicationRepo.findByCandidateAndJob(candidateId,jobID)
        if(existingApplication){
            throw new AppError(
                'You have already applied to this Job',
                StatusCode.BAD_REQUEST,
                'APPLICATION_EXISTS'
            )
        }

        const newApplication = await this.applicationRepo.create({
            jobId:jobID,
            candidateId:candidateId,
            ...(resumeUrl && {resumeUrl})
        })
 

        return newApplication
    }
}