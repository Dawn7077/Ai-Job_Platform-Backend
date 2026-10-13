import { Application } from "../../../../domain/entities/Application";
import { Interview } from "../../../../domain/entities/Interview";
import { ScheduleInterviewPayloadDTO } from "../../../dtos/Company/scheduleInterview.dto"; 

export interface IScheduleInterviewUC{
    execute(payload: ScheduleInterviewPayloadDTO): Promise<{
        interview: Interview;
        application: Application;
    }>
}
