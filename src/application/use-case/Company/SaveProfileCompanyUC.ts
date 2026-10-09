import { inject, injectable } from "inversify";
import { CompanyProfile, CompanyProfileProps } from "../../../domain/entities/CompanyProfile";
import { ICompanyProfileRepo } from "../../../domain/repositories/ICompanyProfileRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { TYPES } from "../../../di/TYPES";
import { ISaveProfileCompanyUC } from "../../interface/I-UseCases/Company/ISaveProfileCompanyUC";


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