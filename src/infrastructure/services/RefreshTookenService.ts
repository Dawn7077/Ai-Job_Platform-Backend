import { IRefreshToken } from '../../application/interface/IRefreshToken.js';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { ITokenService } from '../../application/interface/ITokenService.js';
import redisClient from '../db/redisClient.js';

export class RefreshTokenService implements IRefreshToken{
    constructor(
        private SQLTool:IUserRepository,
        private HashTool:ITokenService, 
    ){}

    async execute(token: string): Promise<{ accessToken: string; }> {
        if(!token)throw new Error("RefreshToken missing")
        try {
            const decoded = await this.HashTool.verifyAccessToken(token)
            // const decoded = await this.HashTool.verifyRefreshToken(token)
            
            const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`)
            if(!storedToken || storedToken!==token){
                throw new Error("Invalid or revoked refresh token session")
            }

            const user  = await this.SQLTool.findByEmail(decoded.userId)
            if(!user)throw new Error("User not found")
            
            const accessToken  = await this.HashTool.generateAccesToken({userId:user.getId(),role:user.getRole()})
            return {accessToken}

        } catch (error) {
            throw new Error ("Invalid Token or expired refresh token session")
        }
    }
}