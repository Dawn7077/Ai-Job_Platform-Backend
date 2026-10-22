import { inject, injectable } from 'inversify';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { R2StorageService } from '../../../infrastructure/services/r2-storage.service';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetResumeUrlUseCase } from '../../interface/use-cases/candidate/i-get-resume-url.use-case';
import { TYPES } from '../../../di/types';
import { GetResumeUrlRequestDTO } from '../../dtos/candidate/get-resume-url.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetResumeUrlUseCase implements IGetResumeUrlUseCase {
  constructor(
    @inject(TYPES.IR2StorageService) private r2Service: R2StorageService,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: GetResumeUrlRequestDTO) {
    const { userId } = dto;
    const profile = await this.candidateProfileRepo.findByUserId(userId);

    if (!profile || !profile.resumeKey) {
      throw new AppError(
        CandidateMessages.NO_PROFILE_OR_RESUME_KEY,
        StatusCode.BAD_REQUEST,
        ErrorCode.BAD_REQUEST
      );
    }

    return await this.r2Service.getPresignedReadUrl(profile.resumeKey);
  }
}
