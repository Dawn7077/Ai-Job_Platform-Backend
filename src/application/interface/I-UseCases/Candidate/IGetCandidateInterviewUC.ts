import { Interview } from "../../../../domain/entities/Interview";

export interface IGetCandidateInterviewUC{
    execute(candidateId: string): Promise<Interview[]>
}