import { inject, injectable } from 'inversify';
import {
  CompanyProfile,
  CompanyProfileProps,
} from '../../../domain/entities/company-profile.entity';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { TYPES } from '../../../di/types';
import { ISaveProfileCompanyUC } from '../../interface/use-cases/company/i-save-company-profile.use-case';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class SaveCompanyProfileUseCase implements ISaveProfileCompanyUC {
  constructor(
    @inject(TYPES.ICompanyProfileRepo) private profileRepo: ICompanyProfileRepo
  ) {}

  async execute(userId: string, profileData: Partial<CompanyProfileProps>) {
    if (!userId) {
      throw new AppError(
        CompanyMessages.USER_ID_REQUIRED,
        StatusCode.UNAUTHORIZED,
        ErrorCode.UNAUTHORIZED
      );
    }
    if (!profileData.companyName) {
      throw new AppError(
        CompanyMessages.COMPANY_NAME_REQUIRED,
        StatusCode.BAD_REQUEST,
        ErrorCode.MISSING_FEILDS
      );
    }
    return await this.profileRepo.upsertProfile(userId, profileData);
  }
}
