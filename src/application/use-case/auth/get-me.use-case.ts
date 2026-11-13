import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetMe } from '../../interface/use-cases/auth/i-get-me.use-case';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../di/types';
import { GetMeRequestDTO } from '../../dtos/auth/get-me.dto';
import { AuthMessages } from '../../../shared/constants/auth-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetMeUseCase implements IGetMe {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(dto: GetMeRequestDTO): Promise<User> {
    const { userId } = dto;
    if (!userId) {
      throw new AppError(
        AuthMessages.MISSING_USER_ID,
        StatusCode.BAD_REQUEST,
        ErrorCode.MISSING_FEILDS
      );
    }

    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new AppError(
        AuthMessages.USER_NOT_FOUND,
        StatusCode.BAD_REQUEST,
        ErrorCode.NOT_FOUND
      );
    }

    return user;
  }
}
