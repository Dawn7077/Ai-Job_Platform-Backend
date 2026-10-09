import {Application as PrismaApplication} from '@prisma/client'
import {Application, ApplicationStage} from '../../../domain/entities/Application'

export class ApplicationMapper{
    static toDomain(record:PrismaApplication):Application{
        return new Application({
            id:record.id,
            jobId:record.jobId,
            candidateId:record.candidateId,
            stage:record.stage as ApplicationStage,
            resumeKey:record.resumeKey,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt, 
        })
    }
}