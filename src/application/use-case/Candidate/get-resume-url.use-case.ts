import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/i-candidate-profile.repository";
import { R2StorageService } from "../../../infrastructure/services/r2-storage.service";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetResumeUrlUseCase } from "../../interface/use-cases/Candidate/i-get-resume-url.use-case";
import { TYPES } from "../../../di/TYPES";
import { GetResumeUrlRequestDTO } from "../../dtos/Candidate/get-resume-url.dto";


@injectable()
export class GetResumeUrlUseCase implements IGetResumeUrlUseCase{
    constructor(
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService,
        @inject(TYPES.ICandidateProfileRepo) private candidateProfileRepo:ICandidateProfileRepository,
    ){}

    async execute(dto:GetResumeUrlRequestDTO){
        const {userId}=dto
        const profile = await this.candidateProfileRepo.findByUserId(userId)

        if(!profile || !profile.resumeKey){
            throw new AppError(
                'Not found Profile or resume uploaded to this profile',
                StatusCode.BAD_REQUEST,
                'BAD_REQUEST'
            )
        }

        return await this.r2Service.getPresignedReadUrl(profile.resumeKey)
    }
}