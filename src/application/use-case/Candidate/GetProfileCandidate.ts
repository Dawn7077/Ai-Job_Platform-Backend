import { CandidateProfile } from "../../../domain/entities/CandidateProfile.js";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetProfileCandidateUseCase{
    execute(userId: string): Promise<CandidateProfile>
}

export class GetProfileCandidateUseCase implements IGetProfileCandidateUseCase{
    constructor(private profileRepo:ICandidateProfileRepository){}

    async execute(userId:string){
        const profile  = await this.profileRepo.findByUserId(userId)
        if(!profile){
            throw new AppError(
                'This profile dose not exists for this userId.Profile not found.',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        return profile 
    }
}