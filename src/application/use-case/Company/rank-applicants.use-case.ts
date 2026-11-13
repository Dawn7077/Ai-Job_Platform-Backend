import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { calculateCandidateJobMatchScore } from '../../../shared/utils/company-job-matching-util';
import { RankApplicantsDTO } from '../../dtos/company/rank-applicants.dto';
import { IRankApplicantsUseCase } from '../../interface/use-cases/company/i-rank-applicants.use-case';

@injectable()
export class RankApplicantsUseCase implements IRankApplicantsUseCase {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository,
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository
  ) {}

  async execute(dto: RankApplicantsDTO) {
    const job = await this.jobRepo.findById(dto.jobId);
    const limit = dto.limit || 10;
    if (!job) {
      throw new AppError(
        CompanyMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'JOB_NOT_FOUND'
      );
    }
    if (job.companyId !== dto.companyId) {
      throw new AppError(
        CompanyMessages.UNAUTHORIZED,
        StatusCode.FORBIDDEN,
        'UNAUTHORIZED'
      );
    }
    const applications = await this.applicationRepo.findByJobId(dto.jobId);

    if (!applications || applications.length === 0) {
      throw new AppError(
        CompanyMessages.APPLICATION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'APPLICATION_NOT_FOUND'
      );
    }

    const scoredApplicants = await Promise.all(
      applications.map(async (app) => {
        const profile = await this.candidateProfileRepo.findByUserId(
          app.candidateId
        );
        const matchedScore = profile
          ? calculateCandidateJobMatchScore(profile, job)
          : 0;

        return {
          applicationId: app.id,
          candidateId: app.candidateId,
          stage: app.stage,
          appliedAt: app.createdAt,
          matchedScore,
          profileData: profile
            ? {
                firstName: profile.firstName,
                lastName: profile.lastName,
                headline: profile.headline,
                skills: profile.skills,
                experience: profile.experience,
                education: profile.education,
              }
            : null,
        };
      })
    );

    return {
      jobData: job.toJSON(),
      applicants: scoredApplicants
        .sort((a, b) => b.matchedScore - a.matchedScore)
        .slice(0, limit),
    };
  }
}
