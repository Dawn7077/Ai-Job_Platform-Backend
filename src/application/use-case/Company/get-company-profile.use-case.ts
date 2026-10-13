import { inject, injectable } from "inversify";
import { CompanyProfile } from "../../../domain/entities/company-profile.entity"; 
import { ICompanyProfileRepo } from "../../../domain/repositories/i-company-profile.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { TYPES } from "../../../di/TYPES";
import { IGetProfileCompanyUC } from "../../interface/use-cases/Company/i-get-company-profile.use-case";



@injectable()
export class GetProfileCompanyUC implements IGetProfileCompanyUC{
    constructor(@inject(TYPES.ICompanyProfileRepo) private profileRepo:ICompanyProfileRepo){}
    async execute(userId:string){
        const profile = await this.profileRepo.findbyUserId(userId)
        if(!profile){
            throw new AppError(
                'Company Profile dose not exist for this user Id.',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        return profile
    }
}