import { CompanyProfile } from "../../../../domain/entities/CompanyProfile";

export interface IGetProfileCompanyUC{
    execute(userId: string): Promise<CompanyProfile>
}