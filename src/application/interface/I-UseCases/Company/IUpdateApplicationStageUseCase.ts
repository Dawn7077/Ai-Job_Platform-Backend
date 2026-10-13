import { Application ,ApplicationStage} from "../../../../domain/entities/Application";
import { UpdateApplicationParamDTO, UpdateApplicationStageRequestDTO } from "../../../dtos/Company/updateApplication.dto";

export interface IUpdateApplicationStageUseCase{
    execute(
        companyId:string,
        {id}:UpdateApplicationParamDTO,
        {stage}:UpdateApplicationStageRequestDTO): Promise<Application>
}