import {  z} from 'zod'

export const MentorChatSchema = z.object({
    userId:z.string().min(1,'User Id is required'), 
    message:z.string().min(1,'Message is required'),  
})

export type MentorChatRequestDTO = z.infer<typeof MentorChatSchema>