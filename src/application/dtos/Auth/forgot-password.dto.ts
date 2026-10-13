import { email, z} from 'zod'

export const ForgotPasswordSchema = z.object({
    email:z.string().email('Invalid email address format.').toLowerCase().trim(),
})

export type ForgotPasswordRequestDTO = z.infer<typeof ForgotPasswordSchema>


export type ForgotPasswordResponseDTO = void