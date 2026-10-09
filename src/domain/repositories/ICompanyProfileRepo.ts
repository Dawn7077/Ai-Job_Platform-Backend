import { CompanyProfile, CompanyProfileProps } from "../entities/CompanyProfile";

export interface ICompanyProfileRepo{
    findbyUserId(userId:string):Promise<CompanyProfile | null>
    upsertProfile(userId:string,data:Partial<CompanyProfileProps>):Promise<CompanyProfile>
}