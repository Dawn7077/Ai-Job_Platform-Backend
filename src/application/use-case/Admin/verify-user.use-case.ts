import { inject, injectable } from 'inversify';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { AdminMessages } from '../../../shared/constants/admin-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IVerifyCompany } from '../../interface/use-cases/admin/i-verify-company.use-case';
import { TYPES } from '../../../di/types';
import { VerifyCompanyBodyDTO } from '../../dtos/admin/verify-company.dto';
import { ErrorCode } from '../../../shared/constants/general-constants';
import { UserRole, UserStatus } from '../../../shared/constants/roles.constant';

@injectable()
export class VerifyCompanyUseCase implements IVerifyCompany {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(payload: VerifyCompanyBodyDTO) {
    const { userId, status, reason: rejectionReason } = payload;
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        AdminMessages.COMPANY_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    if (user?.getRole() !== UserRole.COMPANY) {
      throw new AppError(
        AdminMessages.INVALID_ROLE,
        StatusCode.BAD_REQUEST,
        ErrorCode.INVALID_ROLE
      );
    }
    console.log('verifying--->', rejectionReason);
    await this.userRepo.updateUser(user.getId(), {
      status: status,
      rejectionReason:
        status === UserStatus.SUSPENDED ? rejectionReason : undefined,
    });

    return {
      success: true,
      message: AdminMessages.STATUS_UPDATE(status),
    };
  }
}
