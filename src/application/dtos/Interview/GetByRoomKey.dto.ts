import { z } from 'zod'

export const  GetInterviewByRoomKeyParamSchema = z.object({  
    roomKey:z.string().min(1,'Room Key is required'), 
})

export type GetInterviewByRoomKeyParamDTO= z.infer<typeof GetInterviewByRoomKeyParamSchema>
