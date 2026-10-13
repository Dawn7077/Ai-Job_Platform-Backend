import {  z} from 'zod'
import { User } from '../../../domain/entities/User'

export const LoginSchema = z.object({
    email:z.string().email("Invalid email address format.").toLowerCase().trim(),
    password:z.string().min(1,'password is required')
})

export type LoginRequestDTO = z.infer<typeof LoginSchema>

export interface LoginResponseDTO {
    accessToken:string
    refreshToken:string
    user:User
    isOnboarding:boolean
}