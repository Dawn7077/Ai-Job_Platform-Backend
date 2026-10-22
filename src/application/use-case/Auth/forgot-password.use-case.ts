import { IUserRepository } from '../../../domain/repositories/i-user.repository.js';
import { IEmailService } from '../../interface/services/i-email.service.js';
import { AppError } from '../../../shared/utils/app-errors.util.js';
import { StatusCode } from '../../../shared/constants/status-code.constant.js';
import { generateOtp } from '../../../shared/utils/generate-otp.util.js';
import redisClient, {
  ICacheService,
} from '../../../infrastructure/db/redis/redis-client.db.js';
import {
  CooldownExpiry,
  ExpiryOTP,
} from '../../../shared/constants/roles.constant.js';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../di/types.js';
import { IForgotPasswordUseCase } from '../../interface/use-cases/auth/i-forgot-password.use-case.js';
import { ForgotPasswordRequestDTO } from '../../dtos/auth/forgot-password.dto.js';
import { AuthMessages } from '../../../shared/constants/auth-messages.constant.js';
import { ErrorCode } from '../../../shared/constants/general-constants.js';

@injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IEmailService) private EmailService: IEmailService,
    @inject(TYPES.IRedisService) private RedisService: ICacheService
  ) {}

  async execute(dto: ForgotPasswordRequestDTO): Promise<void> {
    const { email } = dto;
    const user = await this.userRepo.findByEmail(email);
    if (!user)
      throw new AppError(
        AuthMessages.USER_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );

    const otp = generateOtp();
    const otpKey = `otp:${user.getId()}`;

    const cooldownKey = `otp_cooldown:${email}`;
    const ttl = await this.RedisService.ttl(cooldownKey);

    if (ttl > 0) {
      throw new AppError(
        AuthMessages.COOLDOWN_TTL(ttl),
        StatusCode.TOO_MANY_REQUEST,
        ErrorCode.OTP_COOLDOWN_ACTIVE
      );
    }

    await this.RedisService.set(otpKey, otp, ExpiryOTP);
    await this.RedisService.set(cooldownKey, 'true', CooldownExpiry);

    await this.EmailService.sendOtpEmail(email, otp, 'Password Reset OTP');
  }
}
