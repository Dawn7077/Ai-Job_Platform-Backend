import {
  CompanyProfile,
  CompanyProfileProps,
} from '../../../../domain/entities/company-profile.entity';

export interface ISaveProfileCompanyUC {
  execute(
    userId: string,
    profileData: Partial<CompanyProfileProps>
  ): Promise<CompanyProfile>;
}
