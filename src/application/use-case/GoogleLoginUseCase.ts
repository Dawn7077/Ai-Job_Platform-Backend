import { UserRole,User} from "../../domain/entities/User.js";
import { IGoogleAuthService } from "../../domain/interfaces/IGoogleAuthService.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { ITokenService } from "../../infrastructure/repo/ITokenService.js";
import redisClient from "../../infrastructure/db/redisClient.js";

interface GoogleLoginInput{
    token:string
    role:UserRole
}
 
export interface IGoogleService{
    execute(inputData:GoogleLoginInput): Promise<{ accessToken: string; refreshToken: string; user:User}>
}


export class GoogleLoginUseCase implements IGoogleService{
    constructor(
        private googleAuthService:IGoogleAuthService,
        private UserRepo:IUserRepository,
        private tokenService:ITokenService
    ){}

    async execute(inputData:GoogleLoginInput): Promise<{ accessToken: string; refreshToken: string; user:User}>{
        const profile = await this.googleAuthService.verifyandGetProfile(inputData.token)

        let user = await this.UserRepo.findByEmail(profile.email)

        if(!user){
            user = new User({
                name:profile.name,
                email:profile.email,
                role:inputData.role,
                status:"ACTIVE"
            })
        }

        await this.UserRepo.Save(user)

        const accessToken = this.tokenService.generateAccesToken({
            userId:user.getId(),
            role:user.getRole()
        })
        const refreshToken = this.tokenService.generateRefreshToken({
            userId:user.getId(),
            role:user.getRole()
        })

        const refreshTokenKey = `refresh_token:${user.getId()}`
        await redisClient.set(refreshTokenKey,refreshToken,'EX',2*24*60*60)

        return{
            accessToken,
            refreshToken,
            user:user,
        }
    }


}