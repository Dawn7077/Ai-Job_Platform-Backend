import { inject, injectable } from "inversify";
import { CompanyProfile } from "../../../domain/entities/CompanyProfile";
import { ICompanyProfileRepo } from "../../../domain/repositories/ICompanyProfileRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { TYPES } from "../../../di/TYPES";
import { IGetProfileCompanyUC } from "../../interface/I-UseCases/Company/IGetProfileCompanyUC";



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