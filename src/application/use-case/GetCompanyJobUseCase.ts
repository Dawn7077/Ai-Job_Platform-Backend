import { Job } from "../../domain/entities/Job.js";
import { IJobRepository } from "../../domain/repositories/IJobRepository.js";
import { AppError } from "../../shared/AppErrors.js";
import { CompanyMessages } from "../../shared/constants/CompanyMessages.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { IGetJOBCompany, IGetJOBTypeCompany } from "../interface/IGETJobCompany.js";


export class GetJobsUseCase implements IGetJOBCompany{
    constructor(private jobRepo:IJobRepository){}

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
export class GetJobsTypeUseCase implements IGetJOBTypeCompany{
    constructor(private jobRepo:IJobRepository){}

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