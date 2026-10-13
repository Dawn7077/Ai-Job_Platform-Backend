import { CandidateProfile } from "../../../../domain/entities/candidate-profile.entity";
import { GetProfileCandidateRequestDTO } from "../../../dtos/Candidate/get-profile-candidate.dto";

 
export interface IGetProfileCandidateUseCase{
    execute(dto:GetProfileCandidateRequestDTO): Promise<CandidateProfile>
}