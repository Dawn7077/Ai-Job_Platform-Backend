import { Interview } from "../../../domain/entities/Interview.js";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetInterviewByRoomKeyUC{
    execute(roomKey: string): Promise<Interview>
}
export class GetInterviewByRoomKeyUC implements IGetInterviewByRoomKeyUC{
    constructor(
        private interviewRepo:IInterviewRepository
    ){}

    async execute(roomKey:string){
        const interview = await this.interviewRepo.findByRoomKey(roomKey)
        if(!interview){
            throw new AppError(
                'No Interview room found with this Room key',
                StatusCode.NOT_FOUND,
                "INVALID_ROOM_KEY"
            )
        }
        return interview

    }
}