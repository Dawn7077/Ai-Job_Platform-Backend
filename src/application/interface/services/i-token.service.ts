import { UserRole, UserStatus } from '../../../domain/entities/user.entity';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  status: UserStatus;
}

export interface ITokenService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  decodeToken(token: string): string | jwt.JwtPayload | null;
}
