import { inject, injectable } from "inversify";
import { CandidateProfile, CandidateProfileProps } from "../../../domain/entities/candidate-profile.entity";
import { ICandidateProfileRepository } from "../../../domain/repositories/i-candidate-profile.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { ISaveCandidateProfile } from "../../interface/use-cases/Candidate/i-save-candidate-profile.use-case";
import { TYPES } from "../../../di/TYPES";
import { SaveCandidateProfileRequestDTO } from "../../dtos/Candidate/save-profile.dto";

@injectable()
export class SaveCandidateProfile implements ISaveCandidateProfile{
    constructor(@inject(TYPES.ICandidateProfileRepo) private profileRepo:ICandidateProfileRepository){}

    async execute(dto:SaveCandidateProfileRequestDTO){
        // userId:string,profileData:Partial<CandidateProfileProps>
        const{userId,profileData} = dto
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