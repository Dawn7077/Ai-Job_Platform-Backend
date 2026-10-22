import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../shared/constants/status-code.constant';
import { IRegisterUser } from '../../application/interface/use-cases/auth/i-register.use-case';
import { ILogin } from '../../application/interface/use-cases/auth/i-login.use-case';
import { IRefreshToken } from '../../application/interface/services/i-refresh-token.service';
import redisClient from '../../infrastructure/db/redis/redis-client.db';
import { ITokenService } from '../../application/interface/services/i-token.service';
import { IGetMe } from '../../application/interface/use-cases/auth/i-get-me.use-case';
import { IForgotPasswordUseCase } from '../../application/interface/use-cases/auth/i-forgot-password.use-case';
import { IResetPasswordUseCase } from '../../application/interface/use-cases/auth/i-reset-password.use-case';
import { ISignUpOTP } from '../../application/interface/use-cases/auth/i-signup-otp.use-case';
import { IGoogleService } from '../../application/interface/use-cases/auth/i-google-service.use-case';
import { User } from '../../domain/entities/user.entity';
import { AuthMessages } from '../../shared/constants/auth-messages.constant';
import { IReapplyVerificationUseCase } from '../../application/use-case/company/reapply-verification.use-case';
import {
  LoginRequestDTO,
  LoginSchema,
} from '../../application/dtos/auth/login.dto';
import {
  RegisterRequestDTO,
  RegisterSchema,
} from '../../application/dtos/auth/register.dto';
import {
  SendSignUpOTPRequestDTO,
  SendSignUpOTPSchema,
} from '../../application/dtos/auth/signup.dto';
import {
  ForgotPasswordRequestDTO,
  ForgotPasswordSchema,
} from '../../application/dtos/auth/forgot-password.dto';
import {
  ResetPasswordRequestDTO,
  ResetPasswordSchema,
} from '../../application/dtos/auth/reset-password.dto';
import {
  GetMeRequestDTO,
  GetMeSchema,
} from '../../application/dtos/auth/get-me.dto';
import {
  GoogleLoginRequestDTO,
  GoogleLoginSchema,
} from '../../application/dtos/auth/google-login.dto';
import { ResponseHelper } from '../../shared/models/response.model';
import { JwtConstants } from '../../shared/constants/roles.constant';

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.IRegisterUseCase) private registerTool: IRegisterUser,
    @inject(TYPES.ISignupOTPUseCase) private signUpOtpTool: ISignUpOTP,
    @inject(TYPES.ILoginUseCase) private loginTool: ILogin,
    @inject(TYPES.IRefreshToken) private refreshTool: IRefreshToken,
    @inject(TYPES.ITokenService) private tokenTool: ITokenService,
    @inject(TYPES.IGetMeUseCase) private getMeTool: IGetMe,
    @inject(TYPES.IForgotPasswordUseCase)
    private forgotPasswordTool: IForgotPasswordUseCase,
    @inject(TYPES.IResetPasswordUseCase)
    private resetPasswordTool: IResetPasswordUseCase,
    @inject(TYPES.IGoogleAuthService) private googleServiceTool: IGoogleService,
    @inject(TYPES.IReapplyVerificationUseCase)
    private reapplyVerificationUC: IReapplyVerificationUseCase
  ) {}

  async sendSignUpOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: SendSignUpOTPRequestDTO = SendSignUpOTPSchema.parse(req.body);
      const { name, email, password, role } = dto;
      if (!email || !password || !name || !role) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_EMAIL_PASSWORD
        );
      }

      await this.signUpOtpTool.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, AuthMessages.OTP_SENT);
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // const {email,otp} =req.body
      const dto: RegisterRequestDTO = RegisterSchema.parse(req.body);
      if (!dto.email || !dto.otp) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_OTP_EMAIL
        );
      }

      const result = await this.registerTool.execute(dto);

      if ('requiresApproval' in result && result.requiresApproval) {
        return res.status(StatusCode.CREATED).json({
          success: true,
          message: result.message,
          requiresApproval: true,
          user: result.user.toJSON(),
        });
      }

      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: JwtConstants.ACCESS_TOKEN_MAX_AGE, //Access token from .env
      });
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: JwtConstants.REFRESH_TOKEN_MAX_AGE, //Refersh token from .env
      });

      // res.status(StatusCode.CREATED).json({
      //     success:true,
      //     message:AuthMessages.REGISTER_SUCCESS,
      //     user:result.user.toJSON(),
      // })

      return ResponseHelper.success(
        res,
        StatusCode.CREATED,
        { user: result.user.toJSON() },
        AuthMessages.REGISTER_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: LoginRequestDTO = LoginSchema.parse(req.body);
      if (!dto.email || !dto.password)
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_EMAIL_PASSWORD
        );

      const { accessToken, refreshToken, user, isOnboarding } =
        await this.loginTool.execute(dto);

      console.log('isOnboarding=>', isOnboarding);
      //store in redis not done

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false, // development phase https is off
        maxAge: JwtConstants.ACCESS_TOKEN_MAX_AGE, //Access token from .env
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: JwtConstants.REFRESH_TOKEN_MAX_AGE, //Refresh token from .env
      });

      // res.status(StatusCode.OK).json({
      //     success:true,
      //     user:user.toJSON(),
      //     isOnboarding
      // })

      return ResponseHelper.success(res, StatusCode.OK, {
        user: user.toJSON(),
        isOnboarding,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // const {refreshToken} = req.body
      const refreshToken = req.cookies.refresh_token;
      const { accessToken } = await this.refreshTool.execute(refreshToken);

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false,
        maxAge: JwtConstants.ACCESS_TOKEN_MAX_AGE, //Refresh token from .env
      });

      return ResponseHelper.success(res, StatusCode.OK, { accessToken });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (refreshToken) {
        //redis clear req.user
        try {
          const decoded = this.tokenTool.decodeToken(refreshToken);
          if (decoded && typeof decoded === 'object' && 'userId' in decoded)
            await redisClient.del(`refresh_token:${decoded.userId}`);
        } catch (error) {
          //
        }
      }
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        AuthMessages.LOGOUT_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: GetMeRequestDTO = GetMeSchema.parse({
        userId: req.user?.userId,
      });
      const { userId } = dto;
      if (!userId)
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          AuthMessages.UNAUTHORIZED
        );

      const user = await this.getMeTool.execute(dto);
      // logger.info(userId,user.getId())

      return ResponseHelper.success(res, StatusCode.OK, {
        user: user.toJSON(),
      });
      // res.status(StatusCode.OK).json({
      //     success:true,
      //     user:user.toJSON()
      // })
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ForgotPasswordRequestDTO = ForgotPasswordSchema.parse(
        req.body
      );
      const { email } = dto;
      if (!email) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_EMAIL
        );
      }

      await this.forgotPasswordTool.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, AuthMessages.OTP_SENT);
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: ResetPasswordRequestDTO = ResetPasswordSchema.parse(req.body);
      const { email, otp, newPassword } = dto;
      if (!email || !otp || !newPassword) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_FEILDS
        );
      }

      await this.resetPasswordTool.execute(dto);

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        AuthMessages.RESET_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: GoogleLoginRequestDTO = GoogleLoginSchema.parse(req.body);
      const { token, role } = dto;
      if (!token || !role) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_TOKEN_ROLE
        );
      }

      const result = await this.googleServiceTool.execute({ token, role });

      if ('requiresApproval' in result && result.requiresApproval) {
        return ResponseHelper.success(
          res,
          StatusCode.CREATED,
          {
            requiresApproval: true,
            user: result.user.toJSON(),
          },
          result.message
        );
      }

      // const successRes = result as {accessToken:string,refreshToken:string,user:User}
      const { accessToken, refreshToken, user, isOnboarding } = result as {
        accessToken: string;
        refreshToken: string;
        user: User;
        isOnboarding: boolean;
      };

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: false, // development phase https is off
        maxAge: JwtConstants.ACCESS_TOKEN_MAX_AGE, //15 mins
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        maxAge: JwtConstants.REFRESH_TOKEN_MAX_AGE,
      });

      return ResponseHelper.success(res, StatusCode.OK, {
        user: user.toJSON(),
        isOnboarding,
      });
    } catch (error) {
      next(error);
    }
  }

  async reapplyVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_EMAIL_VERIFICATION
        );
      }

      const result = await this.reapplyVerificationUC.execute(email);

      return ResponseHelper.success(res, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  }

  async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, sourceCode } = req.body;

      // Map languages to Piston's expected format and versions
      const languageMap: Record<string, { language: string; version: string }> =
        {
          javascript: { language: 'javascript', version: '18.15.0' },
          python: { language: 'python', version: '3.10.0' },
          java: { language: 'java', version: '15.0.2' },
          cpp: { language: 'cpp', version: '10.2.0' },
        };

      const langConfig = languageMap[language] || languageMap['javascript'];
      if (!langConfig) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          AuthMessages.MISSING_EMAIL_VERIFICATION
        );
      }

      // Send request to your local Piston Docker container using native fetch
      const pistonResponse = await fetch(
        'http://localhost:2000/api/v2/execute',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: sourceCode }],
          }),
        }
      );

      const data = await pistonResponse.json();

      if (!pistonResponse.ok) {
        return res.status(pistonResponse.status).json(data);
      }

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
