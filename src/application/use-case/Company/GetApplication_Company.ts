import { Application } from "../../../domain/entities/Application.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";


export interface IGetApplication_Company{
    execute(companyId:string,applicationId: string,jobId:string): Promise<Application>
}

export class GetApplication_Company implements IGetApplication_Company{
    constructor(
        private applicationRepo:IApplicationRepository,
        private jobRepo:IJobRepository,
    ){}

    async execute(companyId:string,applicationId: string,jobId:string):Promise<Application>{
        console.log('hit GetApplication_Company detail')
        const job = await this.jobRepo.findById(jobId)
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

        const application = await this.applicationRepo.findById(applicationId)

        if(!application){
            throw new AppError(
                'This Job Posting dose not exist',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        if(application.jobId !== jobId){
            throw new AppError(
                'This Application dosent belong to this job posting.',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        return application
    }
}