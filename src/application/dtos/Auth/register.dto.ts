import { z} from 'zod'
import { User } from '../../../domain/entities/User'

export const  RegisterSchema = z.object({
    email:z.string().email("Invalid email address format.").toLowerCase().trim(),
    otp:z.string().min(1,'otp is required')
})

export type RegisterRequestDTO  = z.infer<typeof RegisterSchema>

export type RegisterResponseDTO =
     { message: string; requiresApproval: true; user: User }
   | { accessToken: string; refreshToken: string; user: User };