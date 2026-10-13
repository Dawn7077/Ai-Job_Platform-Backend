import { Interview, InterviewStatusType } from "../entities/interview.entity";
import { InterviewEvaluation } from "../entities/interview-evaluation.entity";

export interface IInterviewRepository{
    create(interview:Interview):Promise<Interview>
    findByRoomKey(roomKey:string):Promise<Interview|null>
    findById(id:string):Promise<Interview|null>
    findByCandidateId(id:string):Promise<Interview[]>
    findByCompanyId(id:string):Promise<Interview[]>
    updateStatus(id:string,status:InterviewStatusType):Promise<void>
    createEvaluation(evaluation:InterviewEvaluation):Promise<InterviewEvaluation>
}