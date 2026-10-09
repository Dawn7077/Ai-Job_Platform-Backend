import { inject, injectable } from "inversify"
import { Application } from "../../../domain/entities/Application"
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo"
import { IJobRepository } from "../../../domain/repositories/IJobRepository"
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService"
import { AppError } from "../../../shared/AppErrors"
import { StatusCode } from "../../../shared/StatusCode"
import { IApplyJobUseCase } from "../../interface/I-UseCases/Candidate/IApplyJobUseCase"
import { TYPES } from "../../../di/TYPES"

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