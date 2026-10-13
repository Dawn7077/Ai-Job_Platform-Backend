import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/interview.entity";
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetInterviewByRoomKeyUC } from "../../interface/use-cases/Company/i-get-interview-by-room-key.use-case";
import { TYPES } from "../../../di/TYPES";
import { GetInterviewByRoomKeyParamDTO } from "../../dtos/Interview/get-by-room-key.dto";

@injectable()
export class GetInterviewByRoomKeyUC implements IGetInterviewByRoomKeyUC{
    constructor(
        @inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository
    ){}

    async execute(dto:GetInterviewByRoomKeyParamDTO){
        const {roomKey} = dto
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