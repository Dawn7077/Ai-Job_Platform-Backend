import { Job } from '../../../domain/entities/job.entity';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { IVectorSearchService } from '../../interface/services/i-vector-search.service';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { UpdateJobRequestDTO } from '../../dtos/company/create-job.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

export interface UpdateJobInputData {
  companyId: string;
  title?: string;
  jobType?: 'REMOTE' | 'HYBRID' | 'ONSITE';
  description?: string;
  skills?: string[];
  salaryMax?: number;
  salaryMin?: number;
  status?: 'OPEN' | 'CLOSED';
}

export interface IUpdateJobUseCase {
  execute(
    jobId: string,
    companyId: string,
    updateData: UpdateJobRequestDTO
  ): Promise<Job>;
}
@injectable()
export class UpdateJobUseCase implements IUpdateJobUseCase {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IVectorSearchService)
    private vectorService: IVectorSearchService
  ) {}

  async execute(
    jobId: string,
    companyId: string,
    updateData: UpdateJobRequestDTO
  ): Promise<Job> {
    const existingJob = await this.jobRepo.findById(jobId);
    if (!existingJob) {
      throw new AppError(
        CompanyMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    if (existingJob.companyId !== companyId) {
      throw new AppError(
        CompanyMessages.UNAUTHORIZED_UPDATE_JOB,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    const company = await this.userRepo.findById(companyId);
    if (!company) {
      throw new AppError(
        CompanyMessages.COMPANY_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    const udpatedJobRecord = new Job({
      id: existingJob.id,
      companyId: existingJob.companyId,
      title: updateData.title ?? existingJob.title,
      jobType: updateData.jobType ?? existingJob.jobType,
      description: updateData.description ?? existingJob.description,
      skills: updateData.skills ?? existingJob.skills,
      salaryMax: updateData.salaryMax ?? existingJob.salaryMax,
      salaryMin: updateData.salaryMin ?? existingJob.salaryMin,
      status: updateData.status ?? existingJob.status,
      createdAt: existingJob.createdAt,
      updatedAt: new Date(),
    });

    const savedJob = await this.jobRepo.updateJob(udpatedJobRecord);

    await this.vectorService.indexJob({
      id: savedJob.id,
      title: savedJob.title,
      company: company.getName(),
      description: savedJob.description,
      skills: savedJob.skills,
      status: savedJob.status,
    });

    return savedJob;
  }
}
