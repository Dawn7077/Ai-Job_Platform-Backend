import {
  Application,
  ApplicationStage,
} from '../../../../domain/entities/application.entity';
import {
  UpdateApplicationParamDTO,
  UpdateApplicationStageRequestDTO,
} from '../../../dtos/company/update-application.dto';

export interface IUpdateApplicationStageUseCase {
  execute(
    companyId: string,
    { id }: UpdateApplicationParamDTO,
    { stage }: UpdateApplicationStageRequestDTO
  ): Promise<Application>;
}
