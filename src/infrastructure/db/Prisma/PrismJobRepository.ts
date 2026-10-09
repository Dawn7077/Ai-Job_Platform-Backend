import {PrismaClient, Job as PrismaJobModel} from '@prisma/client'
import { Job } from '../../../domain/entities/Job'
import { IJobRepository } from '../../../domain/repositories/IJobRepository'
import  { injectable,inject } from 'inversify'
import { TYPES } from '../../../di/TYPES'
import { JobMapper } from '../mappers/JobMapper'
import { BaseRepository } from './BaseRepository'

@injectable()
export class PrismaJobRepository extends BaseRepository implements IJobRepository{ 


    async create(job: Job): Promise<Job> {
        const rawData = job.toJSON()

        const createdJob = await this.prisma.job.create({
            data:{
                id:rawData.id,
                companyId:rawData.companyId,
                title:rawData.title,
                jobType:rawData.jobType as "REMOTE"|"HYBRID"|"ONSITE",
                description:rawData.description,
                skills:rawData.skills,
                salaryMax:rawData.salaryMax,
                salaryMin:rawData.salaryMin,
                status:rawData.status as 'OPEN' | 'CLOSED',
                createdAt:rawData.createdAt,
                updatedAt:rawData.updatedAt,
            }
        })

        return JobMapper.toDomain(createdJob)
    }

    async findById(id: string): Promise<Job | null> {
        const jobRecord = await this.prisma.job.findUnique({
            where:{id}
        })
        if(!jobRecord)return null

        return JobMapper.toDomain(jobRecord)
    }

    async findbyCompanyId(companyId: string): Promise<Job[]> {
        const jobRecords = await this.prisma.job.findMany({
            where:{companyId},
            orderBy:{createdAt:"desc"},
        })

        return jobRecords.map((record)=> JobMapper.toDomain(record))
    }
    async findAll(): Promise<Job[]> {
        const jobRecords = await this.prisma.job.findMany({
            where:{status:'OPEN'},
            orderBy:{createdAt:"desc"},
        })

        return jobRecords.map((record)=> JobMapper.toDomain(record))
    }

    async findByType(companyId:string,jobtype:"REMOTE"|"HYBRID"|"ONSITE"): Promise<Job[]> {
        const jobRecords = await this.prisma.job.findMany({
            where:{
                companyId:companyId,
                jobType:jobtype 
            },
            orderBy:{createdAt:"desc"},
        })
        return jobRecords.map((record)=> JobMapper.toDomain(record))
    }

    async deleteJob(id:string):Promise<void> {
        await this.prisma.job.delete({
            where:{id}
        })
    }

    async updateJob(job: Job): Promise<Job> {
        const raw = job.toJSON()

        const udpatedRecord = await this.prisma.job.update({
            where:{id:raw.id},
            data:{
                title:raw.title,
                jobType:raw.jobType as "REMOTE"|"HYBRID"|"ONSITE",
                description:raw.description,
                skills:raw.skills,
                salaryMax:raw.salaryMax,
                salaryMin:raw.salaryMin,
                status:raw.status as "OPEN"| "CLOSED",
                updatedAt:new Date(),
            }
        })

        return JobMapper.toDomain(udpatedRecord)

    }

}