import { Interview } from "../../../../domain/entities/Interview";
import { GetInterviewByRoomKeyParamDTO } from "../../../dtos/Interview/GetByRoomKey.dto";

export interface IGetInterviewByRoomKeyUC{
    execute(dto:GetInterviewByRoomKeyParamDTO): Promise<Interview>
}