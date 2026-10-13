import { Application } from "../../../../domain/entities/application.entity";
import { GetCompanyApplicationsRequestDTO } from "../../../dtos/Company/applications.dto";

//all application for company

export interface IGetAllApplications_Company{
    execute(dto: GetCompanyApplicationsRequestDTO): Promise<Application[]>
}