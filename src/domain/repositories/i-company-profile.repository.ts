import {
  CompanyProfile,
  CompanyProfileProps,
} from '../../domain/entities/company-profile.entity';

export interface ICompanyProfileRepo {
  findbyUserId(userId: string): Promise<CompanyProfile | null>;
  upsertProfile(
    userId: string,
    data: Partial<CompanyProfileProps>
  ): Promise<CompanyProfile>;
}
