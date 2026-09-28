import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo.js";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";


export interface IGetResumeUrlUseCase{
    execute(userId: string): Promise<string>
}

export class GetResumeUrlUseCase implements IGetResumeUrlUseCase{
    constructor(
        private r2Service:R2StorageService,
        private candidateProfileRepo:ICandidateProfileRepository,
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