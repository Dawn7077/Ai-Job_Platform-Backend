import { inject, injectable } from "inversify"
import { Job } from "../../../domain/entities/job.entity"
import { IJobRepository } from "../../../domain/repositories/i-job.repository"
import { IUserRepository } from "../../../domain/repositories/i-user.repository"
import { IVectorSearchService } from "../../interface/services/i-vector-search.service"
import { AppError } from "../../../shared/utils/app-errors.util"
import { CompanyMessages } from "../../../shared/constants/company-messages.constant"
import { StatusCode } from "../../../shared/constants/status-code.constant"
import { ICreateJobUseCase } from "../../interface/use-cases/Company/i-create-job.use-case"
import { TYPES } from "../../../di/TYPES"
import { CreateJobRequestDTO } from "../../dtos/Company/create-job.dto"


export interface CreateJobInputData{
    companyId:string
    // companyName:string  for embedded search based on company name
    title:string
    jobType:"REMOTE"|"HYBRID"|"ONSITE"
    description:string
    skills:string[]
    salaryMax:number
    salaryMin:number
}


@injectable()
export class CreateJobUseCase implements ICreateJobUseCase{
    constructor(
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
        @inject(TYPES.IUserRepository)private userRepo:IUserRepository,
        @inject(TYPES.IVectorSearchService)private vectorSearchService:IVectorSearchService
    ){}

    async execute(companyId:string,Job_data:CreateJobRequestDTO){
        const company = await this.userRepo.findById(companyId)

        if(!company){
            throw new AppError(
                CompanyMessages.COMPANY_NOT_FOUND,
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        const companyName = company.getName()


        const job =  new Job({
            companyId:companyId,
            title:Job_data.title,
            jobType:Job_data.jobType,
            description:Job_data.description,
            skills:Job_data.skills,
            salaryMax:Job_data.salaryMax,
            salaryMin:Job_data.salaryMin,
            status:"OPEN",
        })

        const savedJob = await this.jobRepo.create(job)

        await this.vectorSearchService.indexJob({
            id:savedJob.id,
            title:savedJob.title,
            company:companyName,
            description:savedJob.description,
            skills:savedJob.skills,
            status:savedJob.status
        })

        return savedJob

    }
}