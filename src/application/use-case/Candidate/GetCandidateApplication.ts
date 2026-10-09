import { inject, injectable } from "inversify";
import { Application, ApplicationProps } from "../../../domain/entities/Application";
import { JobProps } from "../../../domain/entities/Job";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetCandidateApplication } from "../../interface/I-UseCases/Candidate/IGetCandidateApplication";
import { TYPES } from "../../../di/TYPES";


export interface ApplicationDetailsResponse{
    application:ApplicationProps,
    job:JobProps|null
}

@injectable()
export class  GetCandidateApplication implements IGetCandidateApplication {
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository
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