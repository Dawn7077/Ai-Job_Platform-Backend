import { inject, injectable } from "inversify"
import { Job } from "../../../domain/entities/Job"
import { IJobRepository } from "../../../domain/repositories/IJobRepository"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService"
import { AppError } from "../../../shared/AppErrors"
import { CompanyMessages } from "../../../shared/constants/CompanyMessages"
import { StatusCode } from "../../../shared/StatusCode"
import { ICreateJobUseCase } from "../../interface/I-UseCases/Company/ICreateJobUseCase"
import { TYPES } from "../../../di/TYPES"


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