import { Job } from "../../../../domain/entities/Job"
export interface IGetActiveJobById{
    execute(jobId: string): Promise<Job>    
}