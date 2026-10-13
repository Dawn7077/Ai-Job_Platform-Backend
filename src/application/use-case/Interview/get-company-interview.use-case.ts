import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/interview.entity";
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository";
import { TYPES } from "../../../di/TYPES";
import { IGetCompanyInterviewUC } from "../../interface/use-cases/Company/i-get-company-interviews.use-case";

@injectable()
export class GetCompanyInterviewUC implements IGetCompanyInterviewUC{
    constructor(@inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository){}
    async execute(companyId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCompanyId(companyId)
    }
}