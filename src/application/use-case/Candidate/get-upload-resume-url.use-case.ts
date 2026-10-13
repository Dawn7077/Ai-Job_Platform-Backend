import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/i-candidate-profile.repository";
import { R2StorageService } from "../../../infrastructure/services/r2-storage.service";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetUploadResumeUrlUseCase } from "../../interface/use-cases/Candidate/i-get-upload-resume-url.use-case";
import { TYPES } from "../../../di/TYPES";
import { GetUploadResumeURLRequestDTO, GetUploadResumeURLResponsetDTO } from "../../dtos/Candidate/get-upload-resume-url.dto";


@injectable()
export class GetUploadResumeUrlUseCase implements IGetUploadResumeUrlUseCase{
    constructor(
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService, 
    ){}

    async execute(dto:GetUploadResumeURLRequestDTO):Promise<GetUploadResumeURLResponsetDTO>{
        const {fileName,mimeType} =dto
        const allowedMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]

        if(!allowedMimeTypes.includes(mimeType)){
            throw new AppError(
                'Invalid file type. Only PDF and DOC/DOCX file are supported.',
                StatusCode.BAD_REQUEST,
                'INVALID_FILE_TYPE'
            )
        }
        
        return await this.r2Service.getPresignedUploadUrl(fileName,mimeType) 
        
    }
}