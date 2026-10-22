import { inject, injectable } from 'inversify';
import {
  Application,
  ApplicationStage,
} from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetApplicationByJobIdUC } from '../../interface/use-cases/company/i-get-applications-by-jobId.use-case';
import { TYPES } from '../../../di/types';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

// get all applications per jobs for a company
@injectable()
export class GetApplicationByJobIdUseCase implements IGetApplicationByJobIdUC {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository
  ) {}

  async execute(companyId: string, jobId: string, status?: ApplicationStage) {
    const company = await this.userRepo.findById(companyId);
    if (!company) {
      throw new AppError(
        CompanyMessages.UNAUTHORIZED,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new AppError(
        CompanyMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    return await this.applicationRepo.findByJobId(jobId, status);
  }
}
