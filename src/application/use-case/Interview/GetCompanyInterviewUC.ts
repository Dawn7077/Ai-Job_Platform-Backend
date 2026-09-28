import { Interview } from "../../../domain/entities/Interview.js";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js";

export interface IGetCompanyInterviewUC{
    execute(companyId: string): Promise<Interview[]>
}

export class GetCompanyInterviewUC implements IGetCompanyInterviewUC{
    constructor(private interviewRepo:IInterviewRepository){}
    async execute(companyId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCompanyId(companyId)
    }
}