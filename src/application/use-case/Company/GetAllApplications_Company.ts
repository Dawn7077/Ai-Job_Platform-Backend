import { inject, injectable } from "inversify";
import { Application } from "../../../domain/entities/Application";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { TYPES } from "../../../di/TYPES";
import { IGetAllApplications_Company } from "../../interface/I-UseCases/Company/IGetAllApplications_Company";



@injectable()
export class GetAllApplications_Company implements IGetAllApplications_Company{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
    ){}

    async execute(companyId:string):Promise<Application[]>{
        return this.applicationRepo.findByCompanyId(companyId)
    }
}