import { Application ,ApplicationStage} from "../../../../domain/entities/Application";

export interface IUpdateApplicationStageUseCase{
    execute(companyId: string, applicationId: string, stage: ApplicationStage): Promise<Application>
}