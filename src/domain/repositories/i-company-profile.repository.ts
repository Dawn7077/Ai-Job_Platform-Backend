import {
  CompanyProfile,
  CompanyProfileProps,
} from '../../domain/entities/company-profile.entity';

export interface ICompanyProfileRepo {
  findById(id: string): Promise<CompanyProfile | null>;
  findbyUserId(userId: string): Promise<CompanyProfile | null>;
  upsertProfile(
    userId: string,
    data: Partial<CompanyProfileProps>
  ): Promise<CompanyProfile>;
}
