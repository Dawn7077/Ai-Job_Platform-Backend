import { CompanyProfile } from '../../../../domain/entities/company-profile.entity';

export interface IGetProfileCompanyUC {
  execute(userId: string): Promise<CompanyProfile>;
}
