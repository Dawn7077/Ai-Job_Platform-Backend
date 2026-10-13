import { inject, injectable } from "inversify"; 
import { IJobRepository } from "../../../domain/repositories/i-job.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { CompanyMessages } from "../../../shared/constants/company-messages.constant";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetJOBCompany, IGetJOBTypeCompany } from "../../interface/use-cases/Company/i-get-company-jobs.use-case";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetJobsUseCase implements IGetJOBCompany{
    constructor(@inject(TYPES.IJobRepo)private jobRepo:IJobRepository){}

    async execute(companyId:string ){
        if(!companyId){
            throw new AppError(
                CompanyMessages.MISSING_ID,
                StatusCode.NOT_FOUND,
                "COMPANY_ID_MISSING"
            )
        }

        const jobs = await this.jobRepo.findbyCompanyId(companyId) 
        const jobList = jobs.map(job=>job.toJSON()) 
        return { 
            jobList
        }
    }
}
@injectable()
export class GetJobsTypeUseCase implements IGetJOBTypeCompany{
    constructor(@inject(TYPES.IJobRepo)private jobRepo:IJobRepository){}

    async execute(companyId:string,jobType:"REMOTE"|"HYBRID"|"ONSITE"){
        if(!companyId){
            throw new AppError(
                CompanyMessages.MISSING_ID,
                StatusCode.NOT_FOUND,
                "COMPANY_ID_MISSING"
            )
        }

        const jobs = await this.jobRepo.findbyCompanyId(companyId)
        const totalJobs = await this.jobRepo.findByType(companyId,jobType)
        const jobList = jobs.map(job=>job.toJSON())
        console.log("totalJobs=>",totalJobs)
        return {
            totalJobs,
            jobList
        }
    }
}