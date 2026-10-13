import { Job } from "../../../../domain/entities/job.entity"
import { GetActiveJobRequestDTO } from "../../../dtos/Candidate/get-active-job-id.dto"
export interface IGetActiveJobById{
    execute(dto:GetActiveJobRequestDTO): Promise<Job>    
}