import { User } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IRegisterUser } from "../interface/IRegister.js"; 
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { ICacheService } from "../../infrastructure/db/redisClient.js";
import { AppError } from "../../shared/AppErrors.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { RefreshExpiry } from "../../shared/constants/roles.js";
import { AuthMessages } from "../../shared/constants/authMessages.js";
export default class Register implements IRegisterUser{
    constructor(
        private SQLtool:IUserRepository,
        private TokenTool:ITokenService,
        private RedisTool:ICacheService,
    ){}

    async execute(email:string,otp:string){ 
        const cachedData = await this.RedisTool.get(`signup_otp:${email}`)
        if(!cachedData){
            throw new AppError(
                AuthMessages.OTP_EXPIRED,
                StatusCode.BAD_REQUEST,
                'REGISTRAION_ERROR'
            )
        }
        const {name,passwordHash,role,otp:storedOTP} = JSON.parse(cachedData)
        console.log(otp)

        if(storedOTP !== otp){
            throw new AppError(
                AuthMessages.INVALID_OTP,
                StatusCode.BAD_REQUEST,
                'INVALID OTP'
            )
        }

        
        const newUser_ID = crypto.randomUUID()
        const isCompany = role === 'COMPANY'
        
        const newUser = new User({
            id:newUser_ID,
            name,
            email,
            passwordHash,
            role,
            status: isCompany ? 'PENDING':'ACTIVE'
        })

        await this.SQLtool.Save(newUser)

        await this.RedisTool.del(`signup_otp:${email}`)

        if(isCompany){
            return {
                message:AuthMessages.COMPANY_REGISTER_SUCCESS_PENDING,
                requiresApproval:true,
                user:newUser
            }
        }

        const accessToken = this.TokenTool.generateAccesToken({userId:newUser.getId(),role:newUser.getRole()})
        const refreshToken = this.TokenTool.generateRefreshToken({userId:newUser.getId(),role:newUser.getRole()})
        const refreshTokenKey = `refresh_token:${newUser.getId()}`
        await this.RedisTool.set(refreshTokenKey,refreshToken,RefreshExpiry)

        return {accessToken,refreshToken,user:newUser}
    }



}

