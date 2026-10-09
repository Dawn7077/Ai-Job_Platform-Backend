import { CandidateProfile, CandidateProfileProps } from "../../../../domain/entities/CandidateProfile";

export interface ISaveCandidateProfile{
    execute(userId: string, profileData: Partial<CandidateProfileProps>): Promise<CandidateProfile>
}
