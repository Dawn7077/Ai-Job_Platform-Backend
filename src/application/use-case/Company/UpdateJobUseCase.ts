import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
 

export interface UpdateJobInputData{
    companyId:string 
    title?:string
    jobType?:"REMOTE"|"HYBRID"|"ONSITE"
    description?:string
    skills?:string[]
    salaryMax?:number
    salaryMin?:number
    status?:"OPEN"|"CLOSED"
}

export interface IUpdateJobUseCase{
    execute(jobId: string, updateData: UpdateJobInputData): Promise<Job>
}

export class UpdateJobUseCase implements IUpdateJobUseCase{
    constructor(
        private jobRepo:IJobRepository,
        private userRepo:IUserRepository,
        private vectorService:IVectorSearchService
    ){}

    async execute(jobId:string, updateData:UpdateJobInputData):Promise<Job>{
        const existingJob = await this.jobRepo.findById(jobId)
        if(!existingJob){
            throw new AppError(
                'Job record not found',
                StatusCode.NOT_FOUND,
                "NOT_FOUND"
            )
        }

        if(existingJob.companyId !== updateData.companyId){
            throw new AppError(
                'Unauthorized:You do not have the premission to udpate this job.',
                StatusCode.FORBIDDEN,
                "FORBIDDEN"
            )
        }

        const company = await this.userRepo.findById(updateData.companyId)
        if(!company){
            throw new AppError(
                'company account not found',
                StatusCode.NOT_FOUND,
                "NOT_FOUND"
            )
        }

        const udpatedJobRecord = new Job({
            id:existingJob.id,
            companyId:existingJob.companyId,
            title:updateData.title ?? existingJob.title,
            jobType:updateData.jobType ?? existingJob.jobType,
            description:updateData.description ?? existingJob.description,
            skills:updateData.skills ?? existingJob.skills,
            salaryMax:updateData.salaryMax ?? existingJob.salaryMax,
            salaryMin:updateData.salaryMin ?? existingJob.salaryMin,
            status:updateData.status ?? existingJob.status,
            createdAt:existingJob.createdAt,
            updatedAt:new Date()
        })

        const savedJob = await this.jobRepo.updateJob(udpatedJobRecord)

        await this.vectorService.indexJob({
            id:savedJob.id,
            title:savedJob.title,
            company:company.getName(),
            description:savedJob.description,
            skills:savedJob.skills,
            status:savedJob.status,
        })

        return savedJob
         
    }
}