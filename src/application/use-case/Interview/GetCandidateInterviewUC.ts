import { Interview } from "../../../domain/entities/Interview.js";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js";

export interface IGetCandidateInterviewUC{
    execute(candidateId: string): Promise<Interview[]>
}

export class GetCandidateInterviewUC implements IGetCandidateInterviewUC{
    constructor(private interviewRepo:IInterviewRepository){}
    async execute(candidateId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCandidateId(candidateId)
    }
}