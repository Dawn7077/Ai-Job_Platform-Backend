import { UserRole } from "../../domain/entities/User.js"
import jwt from 'jsonwebtoken' 

export interface TokenPayload{
    userId:string
    role:UserRole
}

export interface ITokenService{
    generateAccesToken(payload:TokenPayload):string;
    generateRefreshToken(payload:TokenPayload):string;
    verifyAccessToken(token:string):TokenPayload;
    verifyRefreshToken(token:string):TokenPayload;
    decodeToken(token:string):string | jwt.JwtPayload | null
}