import {PrismaClient, Application as ApplicationPrismaModle} from '@prisma/client'
import { CreateApplicationInputDTO, IApplicationRepository } from '../../domain/repositories/IApplicationRepo.js';
import { Application , ApplicationStage, ApplicationStage as JobAppStage} from '../../domain/entities/Application.js';


export class PrismaApplicationRepo implements IApplicationRepository {
    constructor(private prisma:PrismaClient){}

    async create(data: CreateApplicationInputDTO): Promise<Application> {
        const raw = await this.prisma.application.create({
            data:{
                jobId:data.jobId,
                candidateId:data.candidateId,
                resumeKey:data.resumeKey ?? null,
                stage:JobAppStage.APPLIED,
            },
        })

        return this.convertToEntity(raw)

    }


    async findByCandidateAndJob(candidateId: string, jobId: string): Promise<Application | null> {
        const raw = await this.prisma.application.findUnique({
            where:{
                candidate_job_unique:{candidateId,jobId} // how can we use this here and what is this is it a index candidate_job_unique
            }
        })
        return raw? this.convertToEntity(raw):null
    }

    async findByCandidateId(candidateId: string): Promise<Application[]> {
        const records  = await this.prisma.application.findMany({
            where:{candidateId},
            orderBy:{createdAt:"desc"}
        })
        return records.map( record=> this.convertToEntity(record))
    }

    async findByJobId(jobId: string, stage?: JobAppStage): Promise<Application[]> {
        const records = await this.prisma.application.findMany({
            where:{jobId,
            ...( stage ? {stage}:{} ),
            },
        })
        
        return records.map( record=> this.convertToEntity(record))
    }

    async findById(applicationId: string): Promise<Application | null> {
        const record = await this.prisma.application.findUnique({
            where:{id:applicationId},
        })
        return record ? this.convertToEntity(record):null
    }


    async findByCompanyId(companyId: string): Promise<Application[]> {
        const records  = await this.prisma.application.findMany({
            where:{
                job:{
                    companyId:companyId
                    // select applications.* from applications 
                    // join jobs on jobs.id = applications.jobId 
                    // where jobs.companyId = 'companyId'
                },
            },
            orderBy:{createdAt:"desc"}
        })
        return records.map( record=> this.convertToEntity(record))
    }

    async updateApplication(applicationId:string,stage: JobAppStage): Promise<Application> {
        const updatedRecord = await this.prisma.application.update({
            where:{id:applicationId},
            // data:data(Object type)
            data:{stage}
        })

        return this.convertToEntity(updatedRecord)
    }

    private convertToEntity(record:ApplicationPrismaModle){
        return new Application({
            id:record.id,
            jobId:record.jobId,
            candidateId:record.candidateId,
            stage:record.stage as JobAppStage,
            resumeKey:record.resumeKey,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt, 
        })
    }
}