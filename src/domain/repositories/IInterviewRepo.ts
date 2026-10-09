import { Interview, InterviewStatusType } from "../entities/Interview";
import { InterviewEvaluation } from "../entities/InterviewEvaluation";

export interface IInterviewRepository{
    create(interview:Interview):Promise<Interview>
    findByRoomKey(roomKey:string):Promise<Interview|null>
    findById(id:string):Promise<Interview|null>
    findByCandidateId(id:string):Promise<Interview[]>
    findByCompanyId(id:string):Promise<Interview[]>
    updateStatus(id:string,status:InterviewStatusType):Promise<void>
    createEvaluation(evaluation:InterviewEvaluation):Promise<InterviewEvaluation>
}