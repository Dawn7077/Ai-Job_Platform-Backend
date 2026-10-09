import { UserRole,User} from "../../../domain/entities/User";
import { IGoogleAuthService } from "../../interface/I-UseCases/Auth/IGoogleAuthService";  
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ITokenService } from "../../interface/I-Services/ITokenService";
import redisClient, { ICacheService } from "../../../infrastructure/db/Redis/redisClient";
import { RefreshExpiry } from "../../../shared/constants/roles";
import { AuthMessages } from "../../../shared/constants/authMessages";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'
import { IGoogleService } from "../../interface/I-UseCases/Auth/IGoogleService"; 

export interface GoogleLoginInput{
    token:string
    role:UserRole
}
 

@injectable()
export class GoogleLoginUseCase implements IGoogleService{
    constructor(
        @inject(TYPES.IGoogleAuthService)private googleAuthService:IGoogleAuthService,
        @inject(TYPES.IUserRepository) private UserRepo:IUserRepository,
        @inject(TYPES.ICandidateProfileRepo) private candidateRepo:ICandidateProfileRepository,
        @inject(TYPES.ITokenService) private tokenService:ITokenService,
        @inject(TYPES.IRedisService) private RedisService:ICacheService
    ){}

    async execute(inputData:GoogleLoginInput):Promise<
        | {user:User; requiresApproval:true ; message:string}
        | { accessToken: string; refreshToken: string; user:User ; isOnboarding:boolean}
    >{
        const profile = await this.googleAuthService.verifyandGetProfile(inputData.token)

        let user = await this.UserRepo.findByEmail(profile.email)

        if(!user){
            user = new User({
                name:profile.name,
                email:profile.email,
                role:inputData.role,
                status:inputData.role === 'COMPANY'?'PENDING':"ACTIVE"
            })
        }

        await this.UserRepo.Save(user)

        if(user.getRole()==='COMPANY' && user.getStatus() === 'PENDING'){
            return{
                user:user,
                requiresApproval:true,
                message:AuthMessages.COMPANY_PENDING_GOOGLE
            }
        }

        let isOnboarding =false
        if(user.getRole() ==='CANDIDATE'){
            const candidateProfile = await this.candidateRepo.findByUserId(user.getId())
            isOnboarding = candidateProfile !== null
        }
        

        const accessToken = this.tokenService.generateAccesToken({
            userId:user.getId(),
            role:user.getRole()
        })
        const refreshToken = this.tokenService.generateRefreshToken({
            userId:user.getId(),
            role:user.getRole()
        })

        const refreshTokenKey = `refresh_token:${user.getId()}`
        await this.RedisService.set(refreshTokenKey,refreshToken,RefreshExpiry)

        return{
            accessToken,
            refreshToken,
            user:user,
            isOnboarding
        }
    }


}