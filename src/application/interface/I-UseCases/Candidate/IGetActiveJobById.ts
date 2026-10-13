import { Job } from "../../../../domain/entities/Job"
import { GetActiveJobRequestDTO } from "../../../dtos/Candidate/Get-Active-JobId.dto"
export interface IGetActiveJobById{
    execute(dto:GetActiveJobRequestDTO): Promise<Job>    
}