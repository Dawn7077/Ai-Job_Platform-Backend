import { z} from 'zod'

export const SendSignUpOTPSchema = z.object({
    name:z.string().min(1,'Name is required').trim(),
    email:z.string().email('Invalid email address format.').toLowerCase().trim(),
    password:z.string().min(6,'Password must be atleast 6 characters'),
    role:z.enum(['CANDIDATE','COMPANY','ADMIN'] as const),
})

export type SendSignUpOTPRequestDTO = z.infer<typeof SendSignUpOTPSchema>

export interface SendSignUpOTPResponseDTO {
        email: string;
}