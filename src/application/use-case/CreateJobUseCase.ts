import { Job } from "../../domain/entities/Job.js"
import { IJobRepository } from "../../domain/repositories/IJobRepository.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"
import { IVectorSearchService } from "../../infrastructure/Interface/IVectorSearchService.js"
import { AppError } from "../../shared/AppErrors.js"
import { CompanyMessages } from "../../shared/constants/CompanyMessages.js"
import { StatusCode } from "../../shared/StatusCode.js"


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

export interface ICreateJobUseCase{
    execute(data: CreateJobInputData): Promise<Job>
}

export class CreateJobUseCase implements ICreateJobUseCase{
    constructor(
        private jobRepo:IJobRepository,
        private userRepo:IUserRepository,
        private vectorSearchService:IVectorSearchService
    ){}

    async execute(Job_data:CreateJobInputData){
        const company = await this.userRepo.findById(Job_data.companyId)

        if(!company){
            throw new AppError(
                CompanyMessages.COMPANY_NOT_FOUND,
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        const companyName = company.getName()


        const job =  new Job({
            companyId:Job_data.companyId,
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