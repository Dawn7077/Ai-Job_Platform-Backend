import { CandidateProfile, CandidateProfileProps } from "../entities/CandidateProfile";

export interface ICandidateProfileRepository{
    findByUserId(userId:string):Promise<CandidateProfile |null>
    upsertProfile(userId:string,data:Partial<CandidateProfileProps>):Promise<CandidateProfile>
    updateResumeKey(userId:string,resumeKey:string):Promise<CandidateProfile>
}