import { inject, injectable } from "inversify";
import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { IGetCandidateInterviewUC } from "../../interface/I-UseCases/Candidate/IGetCandidateInterviewUC";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetCandidateInterviewUC implements IGetCandidateInterviewUC{
    constructor(@inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository){}
    async execute(candidateId:string):Promise<Interview[]>{
        return await this.interviewRepo.findByCandidateId(candidateId)
    }
}