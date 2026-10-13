import { z } from 'zod'
// const mongoIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const DeleteJobParamSchema = z.object({ 
    jobId:z.string().min(1,'Job ID is required'), 
})

export type DeleteJobParamtDTO = z.infer<typeof DeleteJobParamSchema>