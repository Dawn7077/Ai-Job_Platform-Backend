import { CandidateProfile, CandidateProfileProps } from "../../../../domain/entities/candidate-profile.entity";
import { SaveCandidateProfileRequestDTO } from "../../../dtos/Candidate/save-profile.dto";

export interface ISaveCandidateProfile{
    execute(dto:SaveCandidateProfileRequestDTO): Promise<CandidateProfile>
}
