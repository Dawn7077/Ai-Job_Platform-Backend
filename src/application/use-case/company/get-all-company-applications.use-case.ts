import { inject, injectable } from 'inversify';
import { Application } from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { TYPES } from '../../../di/types';
import { IGetAllApplications_Company } from '../../interface/use-cases/company/i-get-all-applications-company.use-case';
import { GetCompanyApplicationsRequestDTO } from '../../dtos/company/applications.dto';

//get all application of the company
@injectable()
export class GetAllCompanyApplicationsUseCase implements IGetAllApplications_Company {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository
  ) {}

  async execute(dto: GetCompanyApplicationsRequestDTO): Promise<Application[]> {
    const { companyId } = dto;
    console.log('get all applications => ', companyId);
    return this.applicationRepo.findByCompanyId(companyId);
  }
}
