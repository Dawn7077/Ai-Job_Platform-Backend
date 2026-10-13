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