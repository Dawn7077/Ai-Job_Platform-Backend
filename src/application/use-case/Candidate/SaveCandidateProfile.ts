import { inject, injectable } from "inversify";
import { CandidateProfile, CandidateProfileProps } from "../../../domain/entities/CandidateProfile";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { ISaveCandidateProfile } from "../../interface/I-UseCases/Candidate/ISaveCandidateProfile";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class SaveCandidateProfile implements ISaveCandidateProfile{
    constructor(@inject(TYPES.ICandidateProfileRepo) private profileRepo:ICandidateProfileRepository){}

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