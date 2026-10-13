import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/interview.entity";
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository";
import { IGetCandidateInterviewUC } from "../../interface/use-cases/Candidate/i-get-candidate-interview.use-case";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetCandidateInterviewUC implements IGetCandidateInterviewUC{
    constructor(@inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository){}
    async execute(candidateId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCandidateId(candidateId)
    }
}