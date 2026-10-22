import { inject, injectable } from 'inversify';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { R2StorageService } from '../../../infrastructure/services/r2-storage.service';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetUploadResumeUrlUseCase } from '../../interface/use-cases/candidate/i-get-upload-resume-url.use-case';
import { TYPES } from '../../../di/types';
import {
  GetUploadResumeURLRequestDTO,
  GetUploadResumeURLResponsetDTO,
} from '../../dtos/candidate/get-upload-resume-url.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import {
  ErrorCode,
  RESUME_ALLOWED_MIME_TYPES,
} from '../../../shared/constants/general-constants';

@injectable()
export class GetUploadResumeUrlUseCase implements IGetUploadResumeUrlUseCase {
  constructor(
    @inject(TYPES.IR2StorageService) private r2Service: R2StorageService
  ) {}

  async execute(
    dto: GetUploadResumeURLRequestDTO
  ): Promise<GetUploadResumeURLResponsetDTO> {
    const { fileName, mimeType } = dto;

    if (!RESUME_ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new AppError(
        CandidateMessages.INVALID_FILE_TYPE,
        StatusCode.BAD_REQUEST,
        ErrorCode.INVALID_FILE_TYPE
      );
    }

    return await this.r2Service.getPresignedUploadUrl(fileName, mimeType);
  }
}
