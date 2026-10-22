import { Job } from '../../../../domain/entities/job.entity';
import { GetActiveJobRequestDTO } from '../../../dtos/candidate/get-active-job-id.dto';
export interface IGetActiveJobById {
  execute(dto: GetActiveJobRequestDTO): Promise<Job>;
}
