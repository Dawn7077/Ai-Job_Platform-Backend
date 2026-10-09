import { inject, injectable } from "inversify";
import { Application, ApplicationStage } from "../../../domain/entities/Application";
import { Interview } from "../../../domain/entities/Interview";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { IScheduleInterviewUC } from "../../interface/I-UseCases/Company/IScheduleInterviewUC";
import { TYPES } from "../../../di/TYPES";

export interface ScheduleInterviewPayload{
    applicationId:string
    candidateId:string
    companyId:string
    // interviewerId:string
    scheduledAt:Date
}

@injectable()
export class ScheduleInterviewUC  implements IScheduleInterviewUC {
    constructor(
        @inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository,
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository
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