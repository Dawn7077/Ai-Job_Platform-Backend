import { Job } from "../../../../domain/entities/Job";
import { CreateJobInputData } from "../../../use-case/Company/CreateJobUseCase";

export interface ICreateJobUseCase{
    execute(data: CreateJobInputData): Promise<Job>
}