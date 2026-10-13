import { inject, injectable } from "inversify";
import { CompanyProfile, CompanyProfileProps } from "../../../domain/entities/company-profile.entity";
import { ICompanyProfileRepo } from "../../../domain/repositories/i-company-profile.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { TYPES } from "../../../di/TYPES";
import { ISaveProfileCompanyUC } from "../../interface/use-cases/Company/i-save-company-profile.use-case";


@injectable()
export class SaveProfileCompanyUC implements ISaveProfileCompanyUC{
    constructor(@inject(TYPES.ICompanyProfileRepo) private profileRepo:ICompanyProfileRepo){}

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