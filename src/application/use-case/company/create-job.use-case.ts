import { inject, injectable } from 'inversify';
import { Job, JobStatus } from '../../../domain/entities/job.entity';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
import { IVectorSearchService } from '../../interface/services/i-vector-search.service';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { ICreateJobUseCase } from '../../interface/use-cases/company/i-create-job.use-case';
import { TYPES } from '../../../di/types';
import { CreateJobRequestDTO } from '../../dtos/company/create-job.dto';
import { ErrorCode } from '../../../shared/constants/general-constants';

export interface CreateJobInputData {
  companyId: string;
  // companyName:string  for embedded search based on company name
  title: string;
  jobType: 'REMOTE' | 'HYBRID' | 'ONSITE';
  description: string;
  skills: string[];
  salaryMax: number;
  salaryMin: number;
}

@injectable()
export class CreateJobUseCase implements ICreateJobUseCase {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IVectorSearchService)
    private vectorSearchService: IVectorSearchService
  ) {}

  async execute(companyId: string, Job_data: CreateJobRequestDTO) {
    const company = await this.userRepo.findById(companyId);

    if (!company) {
      throw new AppError(
        CompanyMessages.COMPANY_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    const companyName = company.getName();

    const job = new Job({
      companyId: companyId,
      title: Job_data.title,
      jobType: Job_data.jobType,
      description: Job_data.description,
      skills: Job_data.skills,
      salaryMax: Job_data.salaryMax,
      salaryMin: Job_data.salaryMin,
      status: JobStatus.OPEN,
    });

    const savedJob = await this.jobRepo.create(job);

    await this.vectorSearchService.indexJob({
      id: savedJob.id,
      title: savedJob.title,
      company: companyName,
      description: savedJob.description,
      skills: savedJob.skills,
      status: savedJob.status,
    });

    return savedJob;
  }
}
