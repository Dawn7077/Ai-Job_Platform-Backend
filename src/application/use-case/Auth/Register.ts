import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IRegisterUser } from "../../interface/I-UseCases/Auth/IRegister";  
import { ITokenService } from "../../interface/I-Services/ITokenService";
import { ICacheService } from "../../../infrastructure/db/Redis/redisClient";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { RefreshExpiry } from "../../../shared/constants/roles";
import { AuthMessages } from "../../../shared/constants/authMessages";
import {injectable,inject} from 'inversify'
import {TYPES} from '../../../di/TYPES'

@injectable()
export default class Register implements IRegisterUser{
    constructor(
        @inject(TYPES.IUserRepository) private SQLtool:IUserRepository,
        @inject(TYPES.ITokenService) private TokenTool:ITokenService,
        @inject(TYPES.IRedisService) private RedisTool:ICacheService,
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

