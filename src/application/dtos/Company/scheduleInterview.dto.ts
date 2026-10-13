import { z } from 'zod'

export const  ScheduleInterviewSchema = z.object({  
    applicationId:z.string().min(1,'Application Id is required'),
    candidateId:z.string().min(1,'Candidate Id is required'),
    scheduledAt:z.coerce.date({message:'Valid scheduled date is required'}),
})

export type ScheduleInterviewRequestDTO= z.infer<typeof ScheduleInterviewSchema>

export interface ScheduleInterviewPayloadDTO extends ScheduleInterviewRequestDTO{
    companyId:string
}

// export interface ScheduleInterviewPayload{
//     applicationId:string
//     candidateId:string
//     companyId:string
//     // interviewerId:string
//     scheduledAt:Date
// }