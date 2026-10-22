import { User } from '../../../domain/entities/user.entity';
import { IGoogleAuthService } from '../../interface/services/i-google-auth.service';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { ITokenService } from '../../interface/services/i-token.service';
import redisClient, {
  ICacheService,
} from '../../../infrastructure/db/redis/redis-client.db';
import {
  RefreshExpiry,
  UserRole,
} from '../../../shared/constants/roles.constant';
import { AuthMessages } from '../../../shared/constants/auth-messages.constant';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../di/types';
import { IGoogleService } from '../../interface/use-cases/auth/i-google-service.use-case';
import {
  GoogleLoginRequestDTO,
  GoogleLoginResponseDTO,
} from '../../dtos/auth/google-login.dto';

export interface GoogleLoginInput {
  token: string;
  role: UserRole;
}

@injectable()
export class GoogleLoginUseCase implements IGoogleService {
  constructor(
    @inject(TYPES.IGoogleAuthService)
    private googleAuthService: IGoogleAuthService,
    @inject(TYPES.IUserRepository) private UserRepo: IUserRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateRepo: ICandidateProfileRepository,
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.IRedisService) private RedisService: ICacheService
  ) {}

  async execute(
    inputData: GoogleLoginRequestDTO
  ): Promise<GoogleLoginResponseDTO> {
    const profile = await this.googleAuthService.verifyandGetProfile(
      inputData.token
    );

    let user = await this.UserRepo.findByEmail(profile.email);

    if (!user) {
      user = new User({
        name: profile.name,
        email: profile.email,
        role: inputData.role,
        status: inputData.role === UserRole.COMPANY ? 'PENDING' : 'ACTIVE',
      });
    }

    await this.UserRepo.Save(user);

    if (user.getRole() === UserRole.COMPANY && user.getStatus() === 'PENDING') {
      return {
        user: user,
        requiresApproval: true,
        message: AuthMessages.COMPANY_PENDING_GOOGLE,
      };
    }

    let isOnboarding = false;
    if (user.getRole() === UserRole.CANDIDATE) {
      const candidateProfile = await this.candidateRepo.findByUserId(
        user.getId()
      );
      isOnboarding = candidateProfile !== null;
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: user.getId(),
      role: user.getRole(),
      status: user.getStatus(),
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.getId(),
      role: user.getRole(),
      status: user.getStatus(),
    });

    const refreshTokenKey = `refresh_token:${user.getId()}`;
    await this.RedisService.set(refreshTokenKey, refreshToken, RefreshExpiry);

    return {
      accessToken,
      refreshToken,
      user: user,
      isOnboarding,
    };
  }
}
