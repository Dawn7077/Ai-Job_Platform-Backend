import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import {
  CalculateJobMatchDTO,
  JobMatchResult,
} from '../../dtos/candidate/calculate-job-match.dto';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { calculateTotalExperienceYears } from '../../../shared/utils/calculate-total-year-exp.utils';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import { ICalculateJobMatchUsecase } from '../../interface/use-cases/candidate/i-calculate-job-match.use-case';

//to show the jobmatchscore , skills matched and missing and company overall rating
//this data can be fed to ai for analysisand feedback
@injectable()
export class CalculateJobMatchUseCase implements ICalculateJobMatchUsecase {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.ICompanyProfileRepo)
    private companyProfileRepo: ICompanyProfileRepo
  ) {}

  async execute(dto: CalculateJobMatchDTO): Promise<JobMatchResult> {
    const candidateProfileData = await this.candidateProfileRepo.findByUserId(
      dto.candidateId
    );
    if (!candidateProfileData) {
      throw new AppError(
        CandidateMessages.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'PROFILE_NOT_FOUND'
      );
    }

    const job = await this.jobRepo.findById(dto.jobId);
    if (!job) {
      throw new AppError(
        CandidateMessages.JOB_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'JOB_NOT_FOUND'
      );
    }

    let totalScore = 0;

    const candidateSkills = (candidateProfileData.skills || []).map(
      (s: string) => s.toLowerCase()
    );
    const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());

    const matchedSkills = jobSkills.filter((s) => candidateSkills.includes(s));
    const missingSkills = jobSkills.filter((s) => !candidateSkills.includes(s));

    if (jobSkills.length > 0) {
      const skillMatchRatio = matchedSkills.length / jobSkills.length;
      totalScore = skillMatchRatio * 40;
    } else {
      totalScore += 40;
    }

    const minExp = job.experienceMin || 0;
    let candidateExp = calculateTotalExperienceYears(
      candidateProfileData.experience || []
    );
    if (!candidateExp) candidateExp = 0;

    if (minExp === 0) {
      totalScore += 20;
    } else if (candidateExp >= minExp) {
      totalScore += 20;
    } else {
      const expRation = Math.max(0, candidateExp / minExp);
      totalScore += expRation * 20;
    }

    //candidates internal techscore
    const techScoreAvg = candidateProfileData.internalTechScoreAvg || 0;
    const techScoreRatio = Math.min(5, Math.max(0, techScoreAvg)) / 5;
    totalScore += techScoreRatio * 20;

    const cultureScoreAvg = candidateProfileData.internalCultureScoreAvg || 0;
    const cultureScoreRatio = Math.min(5, Math.max(0, cultureScoreAvg)) / 5;
    totalScore += cultureScoreRatio * 10;

    const endorsementCount = candidateProfileData.endorsementCount || 0;
    const endorsementRatio = Math.min(1, endorsementCount / 5);
    totalScore += endorsementRatio * 10;

    // skills 40%, exp 20 %, techscr 20%, culturescore 10%, endorsmentscr 10%
    const finalMatchPercentage = Math.min(
      100,
      Math.max(0, Math.round(totalScore * 100) / 100)
    );

    const companyProfile = await this.companyProfileRepo.findbyUserId(
      job.companyId
    );
    const companyAvgRating = companyProfile?.averageRating || 0;

    return {
      matchPercentage: finalMatchPercentage,
      matchedSkills: matchedSkills,
      missingSkills: missingSkills,
      companyReputationBoost: companyAvgRating,
    };
  }
}
