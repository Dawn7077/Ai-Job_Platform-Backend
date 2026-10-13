import { Application, ApplicationStage } from "../../../../domain/entities/application.entity";

export interface IGetApplicationByJobIdUC{
    execute(companyId: string, jobId: string, status?: ApplicationStage | undefined): Promise<Application[]>
}