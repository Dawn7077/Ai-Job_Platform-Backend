import { Application } from "../../../domain/entities/Application.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";

export interface IGetAllApplications_Company{
    execute(companyId: string): Promise<Application[]>
}

export class GetAllApplications_Company{
    constructor(
        private applicationRepo:IApplicationRepository,
    ){}

    async execute(companyId:string):Promise<Application[]>{
        return this.applicationRepo.findByCompanyId(companyId)
    }
}