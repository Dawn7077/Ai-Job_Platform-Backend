import { email, z} from 'zod'

export const ResetPasswordSchema = z.object({
    email:z.string().email('Invalid email address format.').toLowerCase().trim(),
    otp:z.string().min(1,'OTP is required'),
    newPassword:z.string().min(6,'Password must be atleast 6 characters'),
})

export type ResetPasswordRequestDTO = z.infer<typeof ResetPasswordSchema>

export type ResetPasswordResponseDTO = void