import { EvaluationDesicion, InterviewStatus, PrismaClient ,Interview as PrismaInterview} from "@prisma/client";
import { IInterviewRepository } from "../../domain/repositories/IInterviewRepo.js";
import { Interview, InterviewStatusType } from "../../domain/entities/Interview.js";
import { InterviewEvaluation } from "../../domain/entities/InterviewEvaluation.js";


export class PrismaInterviewRepo implements IInterviewRepository{
    constructor(private prisma:PrismaClient){}

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

        return this.convertToEntity(created)

    }

    async findByRoomKey(roomKey: string): Promise<Interview | null> {
        const record = await this.prisma.interview.findUnique({
            where:{roomKey}
        })
        if(!record)return null
        return this.convertToEntity(record)
    }

    async findById(id: string): Promise<Interview | null> {
        const record = await this.prisma.interview.findUnique({
            where:{id}
        })
        if(!record)return null
        return this.convertToEntity(record)
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

        return new InterviewEvaluation({
            id:record.id,
            interviewId:record.interviewId,
            technicalScore:record.technicalScore,
            communicationScore:record.communicationScore,
            problemSolvingScore:record.problemSolvingScore,
            notes:record.notes,
            decision:record.decision,
        })
    }

    async findByCandidateId(candidateId: string): Promise<Interview[]> {
        const records = await this.prisma.interview.findMany({
            where:{candidateId},
            orderBy:{scheduledAt:'asc'}
        }) 

        return records.map(record=>this.convertToEntity(record))
    }
    async findByCompanyId(companyId: string): Promise<Interview[]> {
        const records = await this.prisma.interview.findMany({
            where:{companyId},
            orderBy:{scheduledAt:'asc'}
        })

        return records.map(record=>this.convertToEntity(record))
    }

    private convertToEntity(record:PrismaInterview):Interview{
            return new Interview({
                id:record.id,
                applicationId:record.applicationId,
                candidateId:record.candidateId,
                companyId:record.companyId,
                roomKey:record.roomKey!,
                scheduledAt:record.scheduledAt,
                status:record.status,
                createdAt:record.createdAt,
                updatedAt:record.updatedAt
            })
     }
}