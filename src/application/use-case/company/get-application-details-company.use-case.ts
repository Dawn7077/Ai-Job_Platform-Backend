import { inject, injectable } from 'inversify';
import { Application } from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetApplication_Company } from '../../interface/use-cases/company/i-get-application-details.use-case';
import { TYPES } from '../../../di/types';
import { ApplicationDetailsParamDTO } from '../../dtos/company/application-details.dto';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

// get application details
@injectable()
export class GetCompanyApplicationDetailsUseCase implements IGetApplication_Company {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository
  ) {}

  async execute(
    companyId: string,
    dto: ApplicationDetailsParamDTO
  ): Promise<Application> {
    const { jobId, id: applicationId } = dto;
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new AppError(
        CompanyMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'NOT_FOUND'
      );
    }

    if (job.companyId !== companyId) {
      throw new AppError(
        CompanyMessages.UNAUTHORIZED_UPDATE_APPLICATION,
        StatusCode.FORBIDDEN,
        'FORBIDDEN'
      );
    }

    const application = await this.applicationRepo.findById(applicationId);

    if (!application) {
      throw new AppError(
        CompanyMessages.APPLICATION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    if (application.jobId !== jobId) {
      throw new AppError(
        CompanyMessages.APPLICATION_NOT_BELONG_TO_JOB,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    return application;
  }
}
