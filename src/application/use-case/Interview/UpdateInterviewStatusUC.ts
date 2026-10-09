import { InterviewStatusType } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";

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