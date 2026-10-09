import { CandidateProfile } from "../../../../domain/entities/CandidateProfile";

 
export interface IGetProfileCandidateUseCase{
    execute(userId: string): Promise<CandidateProfile>
}