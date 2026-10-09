import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { ResumeParserService } from "../../../infrastructure/ai/pdfParserService";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetResumeTextUseCase } from "../../interface/I-UseCases/Candidate/IGetResumeTextUseCase";
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