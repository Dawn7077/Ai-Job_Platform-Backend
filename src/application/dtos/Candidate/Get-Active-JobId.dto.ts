import { z} from 'zod'

export const GetActiveJobSchema = z.object({ 
    jobId:z.string().min(1,'Job ID is required'),  
})

export type GetActiveJobRequestDTO = z.infer<typeof GetActiveJobSchema>