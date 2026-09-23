import { CandidateProfile, CandidateProfileProps } from "../../../domain/entities/CandidateProfile.js";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface ISaveCandidateProfile{
    execute(userId: string, profileData: Partial<CandidateProfileProps>): Promise<CandidateProfile>
}

export class SaveCandidateProfile implements ISaveCandidateProfile{
    constructor(private profileRepo:ICandidateProfileRepository){}

    async execute(userId:string,profileData:Partial<CandidateProfileProps>){
        if(!userId){
            throw new AppError(
                'Unauthorized: User ID missing',
                StatusCode.UNAUTHORIZED,
                'UNAUTHORIZED'
            )
        }
        if(!profileData.firstName || !profileData.lastName){
            throw new AppError(
                'FirstName and Lastname are required',
                StatusCode.BAD_REQUEST,
                'BAD_REQUEST'
            )
        }
        //returns candidateProfile()
        return await this.profileRepo.upsertProfile(userId,profileData)
    }
}