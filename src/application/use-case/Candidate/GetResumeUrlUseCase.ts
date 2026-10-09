import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetResumeUrlUseCase } from "../../interface/I-UseCases/Candidate/IGetResumeUrlUseCase";
import { TYPES } from "../../../di/TYPES";


@injectable()
export class GetResumeUrlUseCase implements IGetResumeUrlUseCase{
    constructor(
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService,
        @inject(TYPES.ICandidateProfileRepo) private candidateProfileRepo:ICandidateProfileRepository,
    ){}

    async execute(userId:string){
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