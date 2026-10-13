import { Application } from "../../../../domain/entities/Application";
import { GetCompanyApplicationsRequestDTO } from "../../../dtos/Company/applications.dto";

export interface IGetAllApplications_Company{
    execute(dto: GetCompanyApplicationsRequestDTO): Promise<Application[]>
}