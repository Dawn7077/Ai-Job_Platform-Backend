import {PrismaClient, Job as PrismaJobModel} from '@prisma/client'
import { Job } from '../../domain/entities/Job.js'
import { IJobRepository } from '../../domain/repositories/IJobRepository.js'


export class PrismaJobRepository implements IJobRepository{
    constructor(private prisma:PrismaClient){}


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

        return this.convertToEntity(createdJob)
    }

    async findById(id: string): Promise<Job | null> {
        const jobRecord = await this.prisma.job.findUnique({
            where:{id}
        })
        if(!jobRecord)return null

        return this.convertToEntity(jobRecord)
    }

    async findbyCompanyId(companyId: string): Promise<Job[]> {
        const jobRecords = await this.prisma.job.findMany({
            where:{companyId},
            orderBy:{createdAt:"desc"},
        })

        return jobRecords.map((record)=> this.convertToEntity(record))
    }
    async findAll(): Promise<Job[]> {
        const jobRecords = await this.prisma.job.findMany({
            where:{status:'OPEN'},
            orderBy:{createdAt:"desc"},
        })

        return jobRecords.map((record)=> this.convertToEntity(record))
    }

    private convertToEntity(record:PrismaJobModel):Job{
        const skillsArray = Array.isArray(record.skills)
            ?(record.skills as string[])
            :[];

        return new Job({
            id:record.id,
            companyId:record.companyId,
            title:record.title,
            jobType:record.jobType as "REMOTE"|"HYBRID"|"ONSITE",
            description:record.description,
            skills:skillsArray,
            salaryMax:record.salaryMax,
            salaryMin:record.salaryMin,
            status:record.status as "OPEN"|"CLOSED",
            createdAt:record.createdAt,
            updatedAt:record.updatedAt,
        })
    }
}