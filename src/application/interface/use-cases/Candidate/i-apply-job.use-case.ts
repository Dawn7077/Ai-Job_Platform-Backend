import { Application } from "../../../../domain/entities/application.entity"
import { ApplyJobRequestDTO } from "../../../dtos/Candidate/apply-job.dto"

export interface IApplyJobUseCase{
    execute(dto:ApplyJobRequestDTO): Promise<Application>
}