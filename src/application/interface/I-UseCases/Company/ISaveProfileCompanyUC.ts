import { CompanyProfile, CompanyProfileProps } from "../../../../domain/entities/CompanyProfile";

export interface ISaveProfileCompanyUC{
    execute(userId: string, profileData: Partial<CompanyProfileProps>): Promise<CompanyProfile>
}