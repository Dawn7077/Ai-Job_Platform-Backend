import { z } from 'zod'

export const  SubmitEvaluationParamSchema = z.object({  
    interviewId:z.string().min(1,'interview Id is required'), 
})
export const  SubmitEvaluationBodySchema = z.object({  
    technicalScore:z.coerce.number().min(0,'Technical Score must be atleast greater than or equal to 0'), 
    communicationScore:z.coerce.number().min(0,'communication Score must be atleast greater than or equal to 0'), 
    problemSolvingScore:z.coerce.number().min(0,'problemSolving Score must be atleast greater than or equal to 0'), 
    notes:z.string().min(1,'note are required'), 
    decision:z.enum(["HIRED","REJECTED","NEXT_ROUND","PENDING" ])
     
})

export type SubmitEvaluationParamDTO= z.infer<typeof SubmitEvaluationParamSchema>
export type SubmitEvaluationBodyDTO= z.infer<typeof SubmitEvaluationBodySchema>

export interface SubmitEvaluationPayloadDTO extends SubmitEvaluationParamDTO,SubmitEvaluationBodyDTO{}

