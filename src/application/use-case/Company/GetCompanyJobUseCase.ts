import { inject, injectable } from "inversify"; 
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { CompanyMessages } from "../../../shared/constants/CompanyMessages";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetJOBCompany, IGetJOBTypeCompany } from "../../interface/I-UseCases/Company/IGETJobCompany";
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