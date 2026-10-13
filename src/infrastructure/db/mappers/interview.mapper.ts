import { Interview as PrismaInterview ,InterviewEvaluation as PrismaEvaluations} from "@prisma/client";
import { Interview } from "../../../domain/entities/interview.entity";
import { InterviewEvaluation } from "../../../domain/entities/interview-evaluation.entity";

export class InterviewMapper{
    static toDomain(record:PrismaInterview):Interview{
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

    static evaluationToDomain(record:PrismaEvaluations):InterviewEvaluation{
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
}