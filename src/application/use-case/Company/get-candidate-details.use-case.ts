import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetCandidateDetailsUseCase } from '../../interface/use-cases/company/i-get-candidate-details.use-case';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetCandidateDetailsUseCase implements IGetCandidateDetailsUseCase {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private profileRepo: ICandidateProfileRepository,
    @inject(TYPES.IUserRepository)
    private userRepo: IUserRepository
  ) {}

  async execute(userId: string) {
    const profile = await this.profileRepo.findByUserId(userId);
    if (!profile) {
      throw new AppError(
        CompanyMessages.CANDIDATE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    const user = await this.userRepo.findById(profile?.userId);

    return { ...profile.toJSON(), email: user?.getEmail() };
  }
}
