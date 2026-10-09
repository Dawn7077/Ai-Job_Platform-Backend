import {Job as PrismaJob} from '@prisma/client'
import {Job } from '../../../domain/entities/Job'

export class JobMapper{
    static toDomain(record:PrismaJob):Job{
        const skillsArray = Array.isArray(record.skills)?(record.skills as string[]):[]
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