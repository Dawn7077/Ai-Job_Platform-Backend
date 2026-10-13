import { Job } from "../../../../domain/entities/job.entity";
import { CreateJobRequestDTO } from "../../../dtos/Company/create-job.dto"; 

export interface ICreateJobUseCase{
    execute(companyId:string,Job_data:CreateJobRequestDTO): Promise<Job>
}