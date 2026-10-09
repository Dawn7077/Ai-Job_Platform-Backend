import {PrismaClient} from '@prisma/client'
import { CreateApplicationInputDTO, IApplicationRepository } from '../../../domain/repositories/IApplicationRepo';
import { Application , ApplicationStage as JobAppStage} from '../../../domain/entities/Application';
import { ApplicationMapper } from '../mappers/ApplicationMapper';
import {  injectable } from 'inversify'; 
import { BaseRepository } from './BaseRepository';

@injectable()
export class PrismaApplicationRepo extends BaseRepository implements IApplicationRepository {

    async create(data: CreateApplicationInputDTO): Promise<Application> {
        const raw = await this.prisma.application.create({
            data:{
                jobId:data.jobId,
                candidateId:data.candidateId,
                resumeKey:data.resumeKey ?? null,
                stage:JobAppStage.APPLIED,
            },
        })

        return ApplicationMapper.toDomain(raw)

    }


    async findByCandidateAndJob(candidateId: string, jobId: string): Promise<Application | null> {
        const raw = await this.prisma.application.findUnique({
            where:{
                candidate_job_unique:{candidateId,jobId} // how can we use this here and what is this is it a index candidate_job_unique
            }
        })
        return raw? ApplicationMapper.toDomain(raw):null
    }

    async findByCandidateId(candidateId: string): Promise<Application[]> {
        const records  = await this.prisma.application.findMany({
            where:{candidateId},
            orderBy:{createdAt:"desc"}
        })
        return records.map( record=> ApplicationMapper.toDomain(record))
    }

    async findByJobId(jobId: string, stage?: JobAppStage): Promise<Application[]> {
        const records = await this.prisma.application.findMany({
            where:{jobId,
            ...( stage ? {stage}:{} ),
            },
        })
        
        return records.map( record=> ApplicationMapper.toDomain(record))
    }

    async findById(applicationId: string): Promise<Application | null> {
        const record = await this.prisma.application.findUnique({
            where:{id:applicationId},
        })
        return record ? ApplicationMapper.toDomain(record):null
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
        return records.map( record=> ApplicationMapper.toDomain(record))
    }

    async updateApplication(applicationId:string,stage: JobAppStage): Promise<Application> {
        const updatedRecord = await this.prisma.application.update({
            where:{id:applicationId},
            // data:data(Object type)
            data:{stage}
        })

        return ApplicationMapper.toDomain(updatedRecord)
    }

     
}