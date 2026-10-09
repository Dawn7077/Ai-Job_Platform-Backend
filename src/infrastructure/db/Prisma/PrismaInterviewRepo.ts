import { InterviewStatus, PrismaClient } from "@prisma/client";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { Interview, InterviewStatusType } from "../../../domain/entities/Interview";
import { InterviewEvaluation } from "../../../domain/entities/InterviewEvaluation";
import { InterviewMapper } from "../mappers/InterviewMapper";
import { injectable } from "inversify"; 
import { BaseRepository } from "./BaseRepository";

@injectable()
export class PrismaInterviewRepo extends BaseRepository implements IInterviewRepository{ 

    async create(interview: Interview): Promise<Interview> {
        const raw = interview.toJSON()
        const created = await this.prisma.interview.create({
            data:{
                id:raw.id,
                applicationId:raw.applicationId,
                candidateId:raw.candidateId,
                companyId:raw.companyId,
                roomKey:raw.roomKey,
                scheduledAt:raw.scheduledAt,
                status:raw.status as InterviewStatus
            }
        })

        return InterviewMapper.toDomain(created)

    }

    async findByRoomKey(roomKey: string): Promise<Interview | null> {
        const record = await this.prisma.interview.findUnique({
            where:{roomKey}
        })
        if(!record)return null
        return InterviewMapper.toDomain(record)
    }

    async findById(id: string): Promise<Interview | null> {
        const record = await this.prisma.interview.findUnique({
            where:{id}
        })
        if(!record)return null
        return InterviewMapper.toDomain(record)
    }

    async updateStatus(id: string, status: InterviewStatusType): Promise<void> {
        await this.prisma.interview.update({
            where:{id},
            data:{status}
        })
    }

    async createEvaluation(evaluation: InterviewEvaluation): Promise<InterviewEvaluation> {
        const raw = evaluation.toJSON()
        const record = await this.prisma.interviewEvaluation.create({
            data:{
                id:raw.id,
                interviewId:raw.interviewId,
                technicalScore:raw.technicalScore,
                communicationScore:raw.communicationScore,
                problemSolvingScore:raw.problemSolvingScore,
                notes:raw.notes,
                decision:raw.decision
            }
        })

        return InterviewMapper.evaluationToDomain(record)
    }

    async findByCandidateId(candidateId: string): Promise<Interview[]> {
        const records = await this.prisma.interview.findMany({
            where:{candidateId},
            orderBy:{scheduledAt:'asc'}
        }) 

        return records.map(record=>InterviewMapper.toDomain(record))
    }
    async findByCompanyId(companyId: string): Promise<Interview[]> {
        const records = await this.prisma.interview.findMany({
            where:{companyId},
            orderBy:{scheduledAt:'asc'}
        })

        return records.map(record=>InterviewMapper.toDomain(record))
    }

}