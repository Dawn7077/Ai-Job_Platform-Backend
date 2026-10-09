import { Application, ApplicationStage } from "../../../../domain/entities/Application";

export interface IGetApplicationByJobIdUC{
    execute(companyId: string, jobId: string, status?: ApplicationStage | undefined): Promise<Application[]>
}