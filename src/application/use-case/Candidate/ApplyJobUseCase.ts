import { Application } from "../../../domain/entities/Application.js"
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js"
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js"
import { IVectorSearchService } from "../../../infrastructure/Interface/IVectorSearchService.js"
import { AppError } from "../../../shared/AppErrors.js"
import { StatusCode } from "../../../shared/StatusCode.js"

export interface ApplyJobInputDTO{
    candidateId:string
    jobID:string
    resumeUrl?:string
}

export interface IApplyJobUseCase{
    execute(candidateId: string, jobID: string, resumeUrl?: string | undefined): Promise<Application>
}

export class ApplyJobUseCase implements IApplyJobUseCase{
    constructor(
        private applicationRepo:IApplicationRepository,
        private JobRepo:IJobRepository, 
    ){}

    async execute(candidateId:string,jobID:string,resumeUrl?:string):Promise<Application>{
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