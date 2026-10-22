import { inject, injectable } from 'inversify';
// import { CandidateProfile } from '../../../domain/entities/candidate-profile.entity';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetProfileCandidateUseCase } from '../../interface/use-cases/candidate/i-get-profile-candidate.use-case';
import { TYPES } from '../../../di/types';
import { GetProfileCandidateRequestDTO } from '../../dtos/candidate/get-profile-candidate.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetProfileCandidateUseCase implements IGetProfileCandidateUseCase {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private profileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: GetProfileCandidateRequestDTO) {
    const { userId } = dto;
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new AppError(
        CandidateMessages.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    return profile;
  }
}
