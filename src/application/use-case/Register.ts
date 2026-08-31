import { User, UserRole } from "../../domain/entities/User.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IRegisterUser } from "../interface/IRegister.js"; 
import { IHashService } from "../interface/IHashService.js";
import { ITokenService } from "../interface/ITokenService.js";
import redisClient from "../../infrastructure/db/redisClient.js";
export default class Register implements IRegisterUser{
    constructor(
        private SQLtool:IUserRepository,
        private HashTool:IHashService,
        private TokenTool:ITokenService
    ){}

    async execute(name:string,email:string,password:string,role:UserRole){
        const existingUser = await this.SQLtool.findByEmail(email)
        
        if(existingUser){
            throw new Error("Register Error")
        }
        const passwordHash = await this.HashTool.hash(password)
        const newUser_ID = crypto.randomUUID()
        const newUser = new User({
            id:newUser_ID,
            name,
            email,
            passwordHash,
            role
        })

        await this.SQLtool.Save(newUser)

        const accessToken = this.TokenTool.generateAccesToken({userId:newUser.getId(),role:newUser.getRole()})
        const refreshToken = this.TokenTool.generateRefreshToken({userId:newUser.getId(),role:newUser.getRole()})
        const refreshTokenKey = `refresh_token:${newUser.getId()}`
        await redisClient.set(refreshTokenKey,refreshToken,'EX',2 * 24 * 60 * 60)

        return {accessToken,refreshToken,user:newUser}
    }
}