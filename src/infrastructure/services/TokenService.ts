import { ITokenService, TokenPayload } from "../repo/ITokenService.js";
import jwt from 'jsonwebtoken'

export class TokenService implements ITokenService{
    private Access_Secret
    private  Refresh_secret
    constructor( secret:string){
        this.Access_Secret = secret
        this.Refresh_secret = secret
    }

    generateAccesToken(payload: TokenPayload): string {
        const secret =  this.Access_Secret
        if(!secret) throw new Error("JWT secret key missing")
        return jwt.sign({...payload,},secret,{expiresIn:"15m"})
    }

    generateRefreshToken(payload:TokenPayload): string {
        const secret =  this.Refresh_secret
        if(!secret) throw new Error("JWT secret key missing")
        return jwt.sign({...payload,},secret,{expiresIn:"1d"})
    }

//       Generates a random, cryptographically strong string for database-backed refresh tokens
//   generateRefreshToken(): string {
//     return crypto.randomBytes(40).toString('hex');
//   }

    verifyAccessToken(token: string): TokenPayload {
        const secret =  this.Access_Secret
        if(!secret) throw new Error("JWT secret key missing")
        try {
            const decoded = jwt.verify(token,secret) as TokenPayload
             
            return {
                userId:decoded.userId,
                role:decoded.role
            }
        } catch (error) {
            throw new Error("Invalid or expired access token")
        }
    }

    verifyRefreshToken(token:string):TokenPayload{
        const secretKey = this.Refresh_secret
        if(!secretKey)throw new Error("JWT secret key missing")

        try {
            const decoded =  jwt.verify(token,secretKey)as TokenPayload

            return {
                userId:decoded.userId, 
                role:decoded.role
            }
        } catch (error) {
            throw new Error("Invalid or expired refresh token")
        }
    }

    decodeToken(token:string):string | jwt.JwtPayload | null {
        try {
            return jwt.decode(token)
        } catch (error) {
            return null
        }
    }
}