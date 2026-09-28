import { CompanyProfile, CompanyProfileProps } from "../../../domain/entities/CompanyProfile.js";
import { ICompanyProfileRepo } from "../../../domain/repositories/ICompanyProfileRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface ISaveProfileCompanyUC{
    execute(userId: string, profileData: Partial<CompanyProfileProps>): Promise<CompanyProfile>
}

export class SaveProfileCompanyUC implements ISaveProfileCompanyUC{
    constructor(private profileRepo:ICompanyProfileRepo){}

    async execute(userId:string,profileData:Partial<CompanyProfileProps>){
        if(!userId){
            throw new AppError(
                "Unauthorized:User ID missing",
                StatusCode.UNAUTHORIZED,
                'UNAUTHORIZED'
            )
        }
        if(!profileData.companyName){
            throw new AppError(
                "Company Name required",
                StatusCode.BAD_REQUEST,
                'BAD_REQUEST'
            )
        }
        return await this.profileRepo.upsertProfile(userId,profileData)

    }
}