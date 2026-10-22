import { inject, injectable } from 'inversify';
import {
  CandidateProfile,
  CandidateProfileProps,
} from '../../../domain/entities/candidate-profile.entity';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { ISaveCandidateProfile } from '../../interface/use-cases/candidate/i-save-candidate-profile.use-case';
import { TYPES } from '../../../di/types';
import { SaveCandidateProfileRequestDTO } from '../../dtos/candidate/save-profile.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class SaveCandidateProfile implements ISaveCandidateProfile {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private profileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: SaveCandidateProfileRequestDTO) {
    // userId:string,profileData:Partial<CandidateProfileProps>
    const { userId, profileData } = dto;
    if (!userId) {
      throw new AppError(
        CandidateMessages.USER_ID_REQUIRED,
        StatusCode.UNAUTHORIZED,
        'UNAUTHORIZED'
      );
    }
    if (!profileData.firstName || !profileData.lastName) {
      throw new AppError(
        CandidateMessages.FIRSTNAME_LASTNAME_REQUIRED,
        StatusCode.BAD_REQUEST,
        ErrorCode.BAD_REQUEST
      );
    }
    //returns candidateProfile()
    return await this.profileRepo.upsertProfile(userId, profileData);
  }
}
