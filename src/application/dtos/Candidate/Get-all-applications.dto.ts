import {  z} from 'zod'
import { ApplicationProps } from '../../../domain/entities/application.entity'
import { JobProps } from '../../../domain/entities/job.entity'

//all candidate applicatioins 
    export const GetAllApplicationSchema_Candidate = z.object({
        candidateId:z.string().min(1,'candidateId is required'),  
    })
    export type GetAllApplicationsRequestDTO_Cand = z.infer<typeof GetAllApplicationSchema_Candidate>



// application details 
    export const GetCandidateApplicationSchema = z.object({
        candidateId:z.string().min(1,'candidateId is required'),  
        applicationId:z.string().min(1,'Application Id is required'),  
    })

    export type GetCandidateApplicationRequestDTO = z.infer<typeof GetCandidateApplicationSchema>

export interface ApplicationDetailsResponse{
    application:ApplicationProps,
    job:JobProps|null
}