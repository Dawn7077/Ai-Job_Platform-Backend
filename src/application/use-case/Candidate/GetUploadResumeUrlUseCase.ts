import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetUploadResumeUrlUseCase } from "../../interface/I-UseCases/Candidate/IGetUploadResumeUrlUseCase";
import { TYPES } from "../../../di/TYPES";


@injectable()
export class GetUploadResumeUrlUseCase implements IGetUploadResumeUrlUseCase{
    constructor(
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService, 
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