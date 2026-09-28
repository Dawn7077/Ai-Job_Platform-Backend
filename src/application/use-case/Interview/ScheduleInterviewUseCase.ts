import { Application, ApplicationStage } from "../../../domain/entities/Application.js";
import { Interview } from "../../../domain/entities/Interview.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js";

export interface ScheduleInterviewPayload{
    applicationId:string
    candidateId:string
    companyId:string
    // interviewerId:string
    scheduledAt:Date
}

export interface IScheduleInterviewUC{
    execute(payload: ScheduleInterviewPayload): Promise<{
        interview: Interview;
        application: Application;
    }>
}
export class ScheduleInterviewUC{
    constructor(
        private interviewRepo:IInterviewRepository,
        private applicationRepo:IApplicationRepository
    ){}
    async execute(payload:ScheduleInterviewPayload){
        const interview = new Interview({
            applicationId:payload.applicationId,
            candidateId:payload.candidateId,
            companyId:payload.companyId, 
            scheduledAt:payload.scheduledAt
        })
        const savedInterview = await this.interviewRepo.create(interview)

        const updatedApplication = await this.applicationRepo.updateApplication(payload.applicationId,ApplicationStage.INTERVIEW)

        return {
            interview:savedInterview,
            application:updatedApplication 
        }
    }
}