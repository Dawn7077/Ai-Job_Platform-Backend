import { Job } from "../../../../domain/entities/Job";
import { CreateJobRequestDTO } from "../../../dtos/Company/createJob.dto"; 

export interface ICreateJobUseCase{
    execute(companyId:string,Job_data:CreateJobRequestDTO): Promise<Job>
}