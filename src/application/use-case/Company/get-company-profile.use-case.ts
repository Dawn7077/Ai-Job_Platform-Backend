import { inject, injectable } from 'inversify';
import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { TYPES } from '../../../di/types';
import { IGetProfileCompanyUC } from '../../interface/use-cases/company/i-get-company-profile.use-case';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetCompanyProfileUseCase implements IGetProfileCompanyUC {
  constructor(
    @inject(TYPES.ICompanyProfileRepo) private profileRepo: ICompanyProfileRepo
  ) {}
  async execute(userId: string) {
    const profile = await this.profileRepo.findbyUserId(userId);
    if (!profile) {
      throw new AppError(
        CompanyMessages.COMPANY_PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    return profile;
  }
}
