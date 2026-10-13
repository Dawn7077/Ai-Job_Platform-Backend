export enum UserRole{
    CANDIDATE = 'CANDIDATE',
    COMPANY ='COMPANY',
    ADMIN = 'ADMIN'
} 
export enum UserStatus{
    ACTIVE = 'ACTIVE',
    SUSPENDED ='SUSPENDED',
    PENDING = 'PENDING',
    DELETED="DELETED"
}  


export const ExpiryOTP = 60
export const ResetOTPExpiry = 60
export const SignUpOTPExpiry =600
export const RefreshExpiry = 2*24*60*60

export const JwtConstants = {
    ACCESS_TOKEN_MAX_AGE:Number(process.env.JWT_ACCESS_COOKIE_MAX_AGE) || 15*60*1000,
    REFRESH_TOKEN_MAX_AGE:Number(process.env.JWT_REFRESH_COOKIE_MAX_AGE) || 2*24*60*60*1000,
}