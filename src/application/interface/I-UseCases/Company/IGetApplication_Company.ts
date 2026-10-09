import { Application } from "../../../../domain/entities/Application";


export interface IGetApplication_Company{
    execute(companyId:string,applicationId: string,jobId:string): Promise<Application>
}
