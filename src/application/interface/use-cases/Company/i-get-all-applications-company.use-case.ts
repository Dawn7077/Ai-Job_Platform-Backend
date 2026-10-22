import { Application } from '../../../../domain/entities/application.entity';
import { GetCompanyApplicationsRequestDTO } from '../../../dtos/company/applications.dto';

//all application for company

export interface IGetAllApplications_Company {
  execute(dto: GetCompanyApplicationsRequestDTO): Promise<Application[]>;
}
