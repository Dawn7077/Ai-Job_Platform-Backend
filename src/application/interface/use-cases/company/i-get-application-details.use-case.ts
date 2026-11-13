import { Application } from '../../../../domain/entities/application.entity';
import { ApplicationDetailsParamDTO } from '../../../dtos/company/application-details.dto';

// application details
export interface IGetApplication_Company {
  execute(
    companyId: string,
    dto: ApplicationDetailsParamDTO
  ): Promise<Application>;
}
