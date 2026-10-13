import { inject, injectable } from "inversify";
import { CandidateProfile } from "../../../domain/entities/candidate-profile.entity";
import { ICandidateProfileRepository } from "../../../domain/repositories/i-candidate-profile.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetProfileCandidateUseCase } from "../../interface/use-cases/Candidate/i-get-profile-candidate.use-case";
import { TYPES } from "../../../di/TYPES";
import { GetProfileCandidateRequestDTO } from "../../dtos/Candidate/get-profile-candidate.dto";
 
@injectable()
export class GetProfileCandidateUseCase implements IGetProfileCandidateUseCase{
    constructor(@inject(TYPES.ICandidateProfileRepo) private profileRepo:ICandidateProfileRepository){}

    async execute(dto:GetProfileCandidateRequestDTO){
        const {userId} = dto
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