import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo.js";
import { ResumeParserService } from "../../../infrastructure/ai/pdfParserService.js";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetResumeTextUseCase{
    execute(userId: string): Promise<string> 
}

export class GetResumeTextUseCase implements IGetResumeTextUseCase{
    constructor(
        private r2Service:R2StorageService,
        private candidateProfileRepo:ICandidateProfileRepository,
        private resumeParserService:ResumeParserService
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