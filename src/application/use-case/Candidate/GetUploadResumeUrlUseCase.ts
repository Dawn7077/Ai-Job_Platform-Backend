import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo.js";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetUploadResumeUrlUseCase{
    execute(fileName: string, mimeType: string): Promise<{
        uploadUrl: string;
        fileKey: string;
    }>
}

export class GetUploadResumeUrlUseCase implements IGetUploadResumeUrlUseCase{
    constructor(
        private r2Service:R2StorageService, 
    ){}

    async execute(fileName:string,mimeType:string){
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