import nodemailer from 'nodemailer';
import { IEmailService } from "../repo/IEmailService.js";

export class EmailService implements IEmailService{
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST||'smtp.mailtrap.io',
            port:Number(process.env.SMTP_PORT)|| 2525,
            auth:{
                user:process.env.SMTP_User,
                pass:process.env.SMTP_Password
            }
        })
    }

    async sendOtpEmail(email: string, otp: string,subject:string):Promise<void> {
        await this.transporter.sendMail({
            from: `"App Support" <${process.env.SMTP_USER}>`,
            to:email,
            subject:subject, 
            html:`<div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #333;">Authentication Code</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>`
        })
    }
}