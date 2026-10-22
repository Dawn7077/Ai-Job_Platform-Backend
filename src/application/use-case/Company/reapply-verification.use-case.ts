import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../di/types';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';
import { UserStatus } from '../../../shared/constants/roles.constant';

export interface IReapplyVerificationUseCase {
  execute(userId: string): Promise<{
    success: boolean;
    message: string;
  }>;
}
@injectable()
export class ReapplyVerificationUseCase implements IReapplyVerificationUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(
        CompanyMessages.COMPANY_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    if (user.getRole() !== 'COMPANY' || user.getStatus() === 'ACTIVE') {
      throw new AppError(
        CompanyMessages.INVALID_STATE_FOR_REAPPLICATION,
        StatusCode.BAD_REQUEST,
        ErrorCode.INVALID_ROLE
      );
    }

    await this.userRepo.updateUser(user.getId(), {
      status: UserStatus.PENDING,
    });

    return {
      success: true,
      message: 'Your re-application has been submitted for admin review.',
    };
  }
}
