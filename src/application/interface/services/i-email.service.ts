
export interface IEmailService {
    sendOtpEmail(email:string, otp:string,subject:string): Promise<void>
}