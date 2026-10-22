import { inject, injectable } from 'inversify';
import {
  Application,
  ApplicationStage,
} from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { TYPES } from '../../../di/types';
import { IUpdateApplicationStageUseCase } from '../../interface/use-cases/company/i-update-application-stage.use-case';
import {
  UpdateApplicationParamDTO,
  UpdateApplicationStageRequestDTO,
} from '../../dtos/company/update-application.dto';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class UpdateApplicationStageUseCase implements IUpdateApplicationStageUseCase {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository
  ) {}

  async execute(
    companyId: string,
    { id: applicationId }: UpdateApplicationParamDTO,
    { stage }: UpdateApplicationStageRequestDTO
  ) {
    const application = await this.applicationRepo.findById(applicationId);
    if (!application) {
      throw new AppError(
        CompanyMessages.APPLICATION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    const job = await this.jobRepo.findById(application.jobId);
    if (!job) {
      throw new AppError(
        CompanyMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    if (job.companyId !== companyId) {
      throw new AppError(
        CompanyMessages.UNAUTHORIZED_UPDATE_APPLICATION,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    return await this.applicationRepo.updateApplication(applicationId, stage); // returns the udpated application
  }
}
