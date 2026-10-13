import { inject, injectable } from "inversify";
import { Application } from "../../../domain/entities/application.entity";
import { IApplicationRepository } from "../../../domain/repositories/i-application.repository";
import { IJobRepository } from "../../../domain/repositories/i-job.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetApplication_Company } from "../../interface/use-cases/Company/i-get-application-details.use-case";
import { TYPES } from "../../../di/TYPES";
import { ApplicationDetailsParamDTO } from "../../dtos/Company/application-details.dto";

// get application details
@injectable()
export class GetApplication_Company implements IGetApplication_Company{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
    ){}

    async execute(companyId:string,dto:ApplicationDetailsParamDTO):Promise<Application>{
        const {jobId,id:applicationId} = dto
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