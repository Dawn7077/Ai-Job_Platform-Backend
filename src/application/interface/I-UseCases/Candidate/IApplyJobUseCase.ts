import { Application } from "../../../../domain/entities/Application"

export interface IApplyJobUseCase{
    execute(candidateId: string, jobID: string, resumeUrl?: string | undefined): Promise<Application>
}