import { Interview } from "../../../../domain/entities/Interview";

export interface IGetInterviewByRoomKeyUC{
    execute(roomKey: string): Promise<Interview>
}