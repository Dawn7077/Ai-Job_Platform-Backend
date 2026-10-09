import { inject, injectable } from "inversify";
import { Application } from "../../../domain/entities/Application";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetApplication_Company } from "../../interface/I-UseCases/Company/IGetApplication_Company";
import { TYPES } from "../../../di/TYPES";


@injectable()
export class GetApplication_Company implements IGetApplication_Company{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
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