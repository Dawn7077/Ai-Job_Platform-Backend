import {  z} from 'zod'

export const GetUploadResumeURLSchema = z.object({
    fileName:z.string().min(1,'File Name is required'), 
    mimeType:z.string().min(1,'Mime Type is required'),   
})

export type GetUploadResumeURLRequestDTO = z.infer<typeof GetUploadResumeURLSchema>
 export interface GetUploadResumeURLResponsetDTO{
    uploadUrl: string;
    fileKey: string;
 }

// fileName:string,mimeType:string