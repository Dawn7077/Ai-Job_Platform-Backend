import { Application } from "../../../../domain/entities/Application"
import { ApplyJobRequestDTO } from "../../../dtos/Candidate/Apply-job.dto"

export interface IApplyJobUseCase{
    execute(dto:ApplyJobRequestDTO): Promise<Application>
}