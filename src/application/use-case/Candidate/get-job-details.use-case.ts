import { inject, injectable } from 'inversify';
import { Job } from '../../../domain/entities/job.entity';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetActiveJobById } from '../../interface/use-cases/candidate/i-get-jobs-by-id.use-case';
import { TYPES } from '../../../di/types';
import { GetActiveJobRequestDTO } from '../../dtos/candidate/get-active-job-id.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

//get job details
@injectable()
export class GetActiveJobById implements IGetActiveJobById {
  constructor(@inject(TYPES.IJobRepo) private jobRepo: IJobRepository) {}

  async execute(dto: GetActiveJobRequestDTO): Promise<Job> {
    const { jobId } = dto;
    const job = await this.jobRepo.findById(jobId);
    if (!job || job.status !== 'OPEN') {
      throw new AppError(
        CandidateMessages.JOB_CLOSED_OR_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    return job;
  }
}

//get job by id
