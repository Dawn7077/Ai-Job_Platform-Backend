import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { TYPES } from "../../../di/TYPES";
import { IGetCompanyInterviewUC } from "../../interface/I-UseCases/Company/IGetCompanyInterviewUC";

@injectable()
export class GetCompanyInterviewUC implements IGetCompanyInterviewUC{
    constructor(@inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository){}
    async execute(companyId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCompanyId(companyId)
    }
}