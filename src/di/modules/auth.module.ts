import { ContainerModule } from 'inversify';
import { TYPES } from '../types';

import { PrismaTool } from '../../infrastructure/db/prisma/prisma-user.repository';
import { PrismaCandidateProfileRepo } from '../../infrastructure/db/prisma/prisma-candidate-profile.repository';

import { BcryptService } from '../../infrastructure/services/bcrypt.service';
import { TokenService } from '../../infrastructure/services/token.service';
import { RefreshTokenService } from '../../infrastructure/services/refresh-token.service';
import { RedisService } from '../../infrastructure/services/redis.service';
import { EmailService } from '../../infrastructure/services/email.service';
import { Google_Service } from '../../infrastructure/services/google-auth.service';

import Register from '../../application/use-case/auth/register.use-case';
import { LoginUseCase } from '../../application/use-case/auth/login.use-case';
import { SendSignUpOTPUseCase } from '../../application/use-case/auth/signup-otp.use-case';
import { ForgotPasswordUseCase } from '../../application/use-case/auth/forgot-password.use-case';
import { ResetPassswordUseCase } from '../../application/use-case/auth/reset-password.use-case';
import { GoogleLoginUseCase } from '../../application/use-case/auth/google-login.use-case';
import { GetMeUseCase } from '../../application/use-case/auth/get-me.use-case';
import { ReapplyVerificationUseCase } from '../../application/use-case/company/reapply-verification.use-case';

import { AuthController } from '../../presentation/controller/auth.controller';

export const authModule = new ContainerModule(({ bind }) => {
  // repositories
  bind(TYPES.IUserRepository).to(PrismaTool).inSingletonScope();
  bind(TYPES.ICandidateProfileRepo)
    .to(PrismaCandidateProfileRepo)
    .inSingletonScope();

  // services
  bind(TYPES.IHashService).to(BcryptService).inSingletonScope();
  bind(TYPES.ITokenService)
    .toDynamicValue(() => {
      const secret = process.env.JWT_SECRET || 'Default_SecretKey';
      return new TokenService(secret);
    })
    .inSingletonScope();
  bind(TYPES.IRefreshToken).to(RefreshTokenService).inSingletonScope();
  bind(TYPES.IRedisService).to(RedisService).inSingletonScope();
  bind(TYPES.IEmailService).to(EmailService).inSingletonScope();
  bind(TYPES.IGoogleAuthService).to(Google_Service).inSingletonScope();

  // use cases
  bind(TYPES.IRegisterUseCase).to(Register);
  bind(TYPES.ISignupOTPUseCase).to(SendSignUpOTPUseCase);
  bind(TYPES.ILoginUseCase).to(LoginUseCase);
  bind(TYPES.IGetMeUseCase).to(GetMeUseCase);
  bind(TYPES.IForgotPasswordUseCase).to(ForgotPasswordUseCase);
  bind(TYPES.IResetPasswordUseCase).to(ResetPassswordUseCase);
  bind(TYPES.IGoogleLoginUseCase).to(GoogleLoginUseCase);
  bind(TYPES.IReapplyVerificationUseCase).to(ReapplyVerificationUseCase);

  // controllers
  bind(TYPES.AuthController).to(AuthController);
});
