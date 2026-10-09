import {ContainerModule,Bind} from 'inversify'
import {TYPES} from '../TYPES'
import {PrismaClient} from '@prisma/client'

import {PrismaTool} from '../../infrastructure/db/Prisma/PrismaTool'
import {PrismaCandidateProfileRepo} from '../../infrastructure/db/Prisma/PrismaCandidateProfile'

import {BcryptService} from '../../infrastructure/services/BcryptService'
import {TokenService} from '../../infrastructure/services/TokenService'
import {RefreshTokenService} from '../../infrastructure/services/RefreshTookenService'
import {RedisService} from '../../infrastructure/services/RedisService'
import {EmailService} from '../../infrastructure/services/EmailService'
import {Google_Service} from '../../infrastructure/services/GoogleAuthService'

import Register from '../../application/use-case/Auth/Register'
import {LoginUseCase} from '../../application/use-case/Auth/Login'
import {SendSignUpOTPUseCase} from '../../application/use-case/Auth/SignUpOTP'
import {ForgotPasswordUseCase} from '../../application/use-case/Auth/ForgotPassWord'
import {ResetPassswordUseCase} from '../../application/use-case/Auth/ResetPassword'
import {GoogleLoginUseCase} from '../../application/use-case/Auth/GoogleLoginUseCase'
import {GetMeUseCase} from '../../application/use-case/Auth/GetMe'
import {ReapplyVerificationUseCase} from '../../application/use-case/Company/ReapplyVerificationUseCase'

import {AuthController} from '../../presentation/controller/AuthController'



export const authModule = new ContainerModule(({bind})=>{
    // repositories
    bind(TYPES.IUserRepository).to(PrismaTool).inSingletonScope()
    bind(TYPES.ICandidateProfileRepo).to(PrismaCandidateProfileRepo).inSingletonScope()
   
    // services
    bind(TYPES.IHashService).to(BcryptService).inSingletonScope()
    bind(TYPES.ITokenService).toDynamicValue(()=>{
        const secret = process.env.JWT_SECRET || 'Default_SecretKey'
        return new TokenService(secret)
    }).inSingletonScope()
    bind(TYPES.IRefreshToken).to(RefreshTokenService).inSingletonScope()
    bind(TYPES.IRedisService).to(RedisService).inSingletonScope()
    bind(TYPES.IEmailService).to(EmailService).inSingletonScope()
    bind(TYPES.IGoogleAuthService).to(Google_Service).inSingletonScope()
    
    // use cases
    bind(TYPES.IRegisterUseCase).to(Register)
    bind(TYPES.ISignupOTPUseCase).to(SendSignUpOTPUseCase)
    bind(TYPES.ILoginUseCase).to(LoginUseCase)
    bind(TYPES.IGetMeUseCase).to(GetMeUseCase)
    bind(TYPES.IForgotPasswordUseCase).to(ForgotPasswordUseCase)
    bind(TYPES.IResetPasswordUseCase).to(ResetPassswordUseCase)
    bind(TYPES.IGoogleLoginUseCase).to(GoogleLoginUseCase)
    bind(TYPES.IReapplyVerificationUseCase).to(ReapplyVerificationUseCase)

    // controllers   
    bind(TYPES.AuthController).to(AuthController)
})