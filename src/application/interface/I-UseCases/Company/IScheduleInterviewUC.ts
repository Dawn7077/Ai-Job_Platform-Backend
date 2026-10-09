import { Application } from "../../../../domain/entities/Application";
import { Interview } from "../../../../domain/entities/Interview";
import { ScheduleInterviewPayload } from "../../../use-case/Interview/ScheduleInterviewUseCase";

export interface IScheduleInterviewUC{
    execute(payload: ScheduleInterviewPayload): Promise<{
        interview: Interview;
        application: Application;
    }>
}
