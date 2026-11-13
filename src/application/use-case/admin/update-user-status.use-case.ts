import { inject, injectable } from 'inversify';
import { UserStatus } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IUpdateUserStatusUC } from '../../interface/use-cases/admin/i-update-user-status.use-case';
import { TYPES } from '../../../di/types';
import { ErrorCode } from '../../../shared/constants/general-constants';
import { AdminMessages } from '../../../shared/constants/admin-messages.constant';

@injectable()
export class UpdateUserStatusUC implements IUpdateUserStatusUC {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}
  async execute(userId: string, status: UserStatus, adminId: string) {
    if (userId === adminId) {
      throw new AppError(
        AdminMessages.CANNOT_MODIFY_OWN_ACCOUNT,
        StatusCode.BAD_REQUEST,
        ErrorCode.SELF_MODIFICATION_DISALLOWED
      );
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(
        AdminMessages.USER_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    await this.userRepo.updateUser(userId, { status });
    return {
      success: true,
      message: `User Status has been updated to ${status}`,
    };
  }
}
