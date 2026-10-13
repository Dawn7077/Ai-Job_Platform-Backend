import { InterviewStatusType } from "../../../domain/entities/interview.entity";
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";

export interface IUpdateInterviewStatusUC{
    execute(interviewId: string, status: InterviewStatusType): Promise<void>
}

export class UpdateInterviewStatusUC implements IUpdateInterviewStatusUC{
    constructor(
        private interviewRepo:IInterviewRepository,
    ){}

    async execute(interviewId:string,status:InterviewStatusType){
        const interview = await this.interviewRepo.findById(interviewId)
        if(!interview){
            throw new AppError(
                'No Interview room found with this Room key',
                StatusCode.NOT_FOUND,
                "INVALID_ROOM_KEY"
            )
        }

        await this.interviewRepo.updateStatus(interviewId,status)
    }
}