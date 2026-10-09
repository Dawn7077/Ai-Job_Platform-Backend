import { inject, injectable } from "inversify";
import { CandidateProfile } from "../../../domain/entities/CandidateProfile";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetProfileCandidateUseCase } from "../../interface/I-UseCases/Candidate/IGetProfileCandidateUseCase";
import { TYPES } from "../../../di/TYPES";
 
@injectable()
export class GetProfileCandidateUseCase implements IGetProfileCandidateUseCase{
    constructor(@inject(TYPES.ICandidateProfileRepo) private profileRepo:ICandidateProfileRepository){}

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