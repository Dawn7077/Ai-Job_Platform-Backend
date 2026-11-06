import {
  CalculateJobMatchDTO,
  JobMatchResult,
} from '../../../dtos/candidate/calculate-job-match.dto';

export interface ICalculateJobMatchUsecase {
  execute(dto: CalculateJobMatchDTO): Promise<JobMatchResult>;
}
