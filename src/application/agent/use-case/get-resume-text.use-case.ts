import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/i-candidate-profile.repository";
import { ResumeParserService } from "../../../infrastructure/ai/pdf-parser.service";
import { R2StorageService } from "../../../infrastructure/services/r2-storage.service";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetResumeTextUseCase } from "../../interface/use-cases/Candidate/i-get-resume-text.use-case";
import { TYPES } from "../../../di/TYPES";


@injectable()
export class GetResumeTextUseCase implements IGetResumeTextUseCase{
    constructor(
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService,
        @inject(TYPES.ICandidateProfileRepo) private candidateProfileRepo:ICandidateProfileRepository,
        @inject(TYPES.IResumeParserService) private resumeParserService:ResumeParserService
    ){}

    async execute(userId:string){
        console.log('ResumeParserService✅',userId)
        const profile = await this.candidateProfileRepo.findByUserId(userId)
        
        console.log('profile✅',profile)
        if(!profile || !profile.resumeKey){
            throw new AppError(
                'Not found Profile or no resume uploaded for this candidate',
                StatusCode.NOT_FOUND,
                'RESUME_NOT_FOUND'
            )
        }
        if(profile)console.log('Profile✅',profile.resumeKey)
        const fileBuffer = await this.r2Service.getFileBuffer(profile.resumeKey)
        if(fileBuffer && profile.resumeKey){
            console.log('filebuffer and resume key found=>',profile.resumeKey)
        }
        return this.resumeParserService.extractTextFromPdf(fileBuffer)

    }
}