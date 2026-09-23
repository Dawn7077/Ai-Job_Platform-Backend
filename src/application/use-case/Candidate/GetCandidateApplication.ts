import { Application, ApplicationProps } from "../../../domain/entities/Application.js";
import { JobProps } from "../../../domain/entities/Job.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";


export interface ApplicationDetailsResponse{
    application:ApplicationProps,
    job:JobProps|null
}

export interface IGetCandidateApplication{
    execute(candidateId: string, applicationId: string): Promise<ApplicationDetailsResponse>
}

export class  GetCandidateApplication implements IGetCandidateApplication {
    constructor(
        private applicationRepo:IApplicationRepository,
        private jobRepo:IJobRepository
    ){}

    async execute(candidateId:string,applicationId:string):Promise<ApplicationDetailsResponse>{
        const application = await this.applicationRepo.findById(applicationId)

        if(!application){
            throw new AppError(
                'Application dosent exit',
                StatusCode.NOT_FOUND,
                'APPLICATION_NOT_FOUND'
            )
        }

        if(application.candidateId !== candidateId){
            throw new AppError(
                'UNAUTHORIZED access to Application',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        const jobData = await this.jobRepo.findById(application.jobId)

        return {
            application:application.toJSON(),
            job:jobData ? jobData?.toJSON(): null 
        }
    }
}

//get a specific application for a candidate 