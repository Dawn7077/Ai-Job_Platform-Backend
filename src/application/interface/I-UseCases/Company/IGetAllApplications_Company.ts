import { Application } from "../../../../domain/entities/Application";

export interface IGetAllApplications_Company{
    execute(companyId: string): Promise<Application[]>
}