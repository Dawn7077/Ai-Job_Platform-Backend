import { z} from 'zod'
import { User } from '../../../domain/entities/User'

export const GetMeSchema = z.object({
    userId:z.string().min(1,'User ID is required')  
})

export type GetMeRequestDTO = z.infer<typeof GetMeSchema>
export type GetMeResponseDTO = User