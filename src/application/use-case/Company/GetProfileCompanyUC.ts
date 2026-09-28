import { CompanyProfile } from "../../../domain/entities/CompanyProfile.js";
import { ICompanyProfileRepo } from "../../../domain/repositories/ICompanyProfileRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetProfileCompanyUC{
    execute(userId: string): Promise<CompanyProfile>
}


export class GetProfileCompanyUC implements IGetProfileCompanyUC{
    constructor(private profileRepo:ICompanyProfileRepo){}
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