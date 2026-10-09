import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetInterviewByRoomKeyUC } from "../../interface/I-UseCases/Company/IGetInterviewByRoomKeyUC";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetInterviewByRoomKeyUC implements IGetInterviewByRoomKeyUC{
    constructor(
        @inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository
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