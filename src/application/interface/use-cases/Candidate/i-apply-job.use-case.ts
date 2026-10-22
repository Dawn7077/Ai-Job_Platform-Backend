import { Application } from '../../../../domain/entities/application.entity';
import { ApplyJobRequestDTO } from '../../../dtos/candidate/apply-job.dto';

export interface IApplyJobUseCase {
  execute(dto: ApplyJobRequestDTO): Promise<Application>;
}
