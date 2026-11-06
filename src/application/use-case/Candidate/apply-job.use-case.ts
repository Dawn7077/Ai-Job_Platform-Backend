import { inject, injectable } from 'inversify';
import { Application } from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IApplyJobUseCase } from '../../interface/use-cases/candidate/i-apply-job.use-case';
import { TYPES } from '../../../di/types';
import { ApplyJobRequestDTO } from '../../dtos/candidate/apply-job.dto';
import { JobStatus } from '../../../domain/entities/job.entity';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { calculateCandidateJobMatchScore } from '../../../shared/utils/company-job-matching-util';

export interface ApplyJobInputDTO {
  candidateId: string;
  jobID: string;
  resumeUrl?: string;
}

// apply to job and adds the matchscore to the
// application data yet to be added to schema, mappers, dto and entity

@injectable()
export class ApplyJobUseCase implements IApplyJobUseCase {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: ApplyJobRequestDTO): Promise<Application> {
    const { candidateId, jobId, resumeUrl } = dto;
    console.log('applyUsecase Executing ...');
    const job = await this.jobRepo.findById(jobId);
    if (!job) {
      throw new AppError(
        CandidateMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.JOB_NOT_FOUND
      );
    }
    if (job.status !== JobStatus.OPEN) {
      throw new AppError(
        CandidateMessages.JOB_CLOSED,
        StatusCode.BAD_REQUEST,
        ErrorCode.JOB_CLOSED
      );
    }

    const existingApplication =
      await this.applicationRepo.findByCandidateAndJob(candidateId, jobId);
    if (existingApplication) {
      throw new AppError(
        CandidateMessages.APPLICATION_EXISTS,
        StatusCode.BAD_REQUEST,
        ErrorCode.APPLICATION_EXISTS
      );
    }

    const candidateProfile =
      await this.candidateProfileRepo.findByUserId(candidateId);
    if (!candidateProfile) {
      throw new AppError(
        CandidateMessages.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND
      );
    }

    //match totalScore check
    const matchScore = calculateCandidateJobMatchScore(candidateProfile, job);
    console.log('matchScore=', matchScore, '%');
    const newApplication = await this.applicationRepo.create({
      jobId: jobId,
      candidateId: candidateId,
      ...(resumeUrl && { resumeUrl }),
    });

    return newApplication;
  }
}
