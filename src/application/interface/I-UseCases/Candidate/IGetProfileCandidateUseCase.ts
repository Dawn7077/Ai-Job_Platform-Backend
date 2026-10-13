import { CandidateProfile } from "../../../../domain/entities/CandidateProfile";
import { GetProfileCandidateRequestDTO } from "../../../dtos/Candidate/get-profile-candidate.dto";

 
export interface IGetProfileCandidateUseCase{
    execute(dto:GetProfileCandidateRequestDTO): Promise<CandidateProfile>
}