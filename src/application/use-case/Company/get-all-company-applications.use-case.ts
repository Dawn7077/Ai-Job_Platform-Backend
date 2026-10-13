import { inject, injectable } from "inversify";
import { Application } from "../../../domain/entities/application.entity";
import { IApplicationRepository } from "../../../domain/repositories/i-application.repository";
import { TYPES } from "../../../di/TYPES";
import { IGetAllApplications_Company } from "../../interface/use-cases/Company/i-get-all-applications-company.use-case";
import { GetCompanyApplicationsRequestDTO } from "../../dtos/Company/applications.dto";


//get all application of the company
@injectable()
export class GetAllApplications_Company implements IGetAllApplications_Company{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
    ){}

    async execute(dto:GetCompanyApplicationsRequestDTO):Promise<Application[]>{
        const {companyId} = dto
        return this.applicationRepo.findByCompanyId(companyId)
    }
}