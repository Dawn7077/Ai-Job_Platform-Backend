import { UserRole,User} from "../../domain/entities/User.js";
import { IGoogleAuthService } from "../../domain/repositories/IGoogleAuthService.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import redisClient, { ICacheService } from "../../infrastructure/db/redisClient.js";
import { RefreshExpiry } from "../../shared/constants/roles.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";

interface GoogleLoginInput{
    token:string
    role:UserRole
}
 
export interface IGoogleService{
    execute(inputData:GoogleLoginInput): Promise<
    | {user:User; requiresApproval:true ; message:string}
    | { accessToken: string; refreshToken: string; user:User}>
}


export class GoogleLoginUseCase implements IGoogleService{
    constructor(
        private googleAuthService:IGoogleAuthService,
        private UserRepo:IUserRepository,
        private tokenService:ITokenService,
        private RedisService:ICacheService
    ){}

    async execute(inputData:GoogleLoginInput):Promise<
        | {user:User; requiresApproval:true ; message:string}
        | { accessToken: string; refreshToken: string; user:User}
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
        }
    }


}