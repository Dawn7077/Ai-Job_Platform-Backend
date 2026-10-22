import { inject, injectable } from 'inversify';
import {
  Application,
  ApplicationProps,
} from '../../../domain/entities/application.entity';
import { JobProps } from '../../../domain/entities/job.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetCandidateApplication } from '../../interface/use-cases/candidate/i-get-candidate-application.use-case';
import { TYPES } from '../../../di/types';
import {
  ApplicationDetailsResponse,
  GetCandidateApplicationRequestDTO,
} from '../../dtos/candidate/get-all-applications.dto';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

// get application details for a candidate
@injectable()
export class GetCandidateApplication implements IGetCandidateApplication {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository
  ) {}

  async execute(
    dto: GetCandidateApplicationRequestDTO
  ): Promise<ApplicationDetailsResponse> {
    const { candidateId, applicationId } = dto;

    const application = await this.applicationRepo.findById(applicationId);

    if (!application) {
      throw new AppError(
        CandidateMessages.APPLICATION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.APPLICATION_NOT_FOUND
      );
    }

    if (application.candidateId !== candidateId) {
      throw new AppError(
        CandidateMessages.UNAUTHORIZED_ACCESS_TO_APPLICATION,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    const jobData = await this.jobRepo.findById(application.jobId);

    return {
      application: application.toJSON(),
      job: jobData ? jobData?.toJSON() : null,
    };
  }
}

//get a specific application details for a candidate
