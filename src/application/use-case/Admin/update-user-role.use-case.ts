import { inject, injectable } from 'inversify';
import { UserRole } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { TYPES } from '../../../di/types';
import { IUpdateUserRoleUC } from '../../interface/use-cases/admin/i-update-user-role.use-case';
import { AdminMessages } from '../../../shared/constants/admin-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class UpdateUserRoleUC implements IUpdateUserRoleUC {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(userId: string, role: UserRole, adminId: string) {
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

    await this.userRepo.updateUser(userId, { role });

    return {
      success: true,
      message: `User Role has been updated to ${role}`,
    };
  }
}
