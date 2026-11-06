import { inject } from 'inversify';
import { TYPES } from '../../../di/types';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import { IJobMatchAiAnalysisUseCase } from '../interfaces/i-job-match-ai-analysis.use-case';
import {
  JobAiMatchAnalysisDTO,
  JobAiMatchAnalysisResult,
} from '../../dtos/agent/job-ai-match-analysis.dto';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { ICompanyReviewRepository } from '../../../domain/repositories/i-company-review-repository';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { calculateCandidateJobMatchScore } from '../../../shared/utils/company-job-matching-util';
import { logger } from '../../../shared/utils/loggers.util';

//used for ai analysis on the jobs with company internal
// data for the candidate job process and improvement feedbacks
export class JobMatchAiAnalysisUseCase implements IJobMatchAiAnalysisUseCase {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository,
    @inject(TYPES.ICompanyProfileRepo)
    private companyProfileRepo: ICompanyProfileRepo,
    @inject(TYPES.ICompanyReviewRepository)
    private companyReviewRepo: ICompanyReviewRepository,
    @inject(TYPES.GatewayModel)
    private aiService: GatewayModels
  ) {}

  async execute(dto: JobAiMatchAnalysisDTO): Promise<JobAiMatchAnalysisResult> {
    const candidateProfile = await this.candidateProfileRepo.findByUserId(
      dto.candidateId
    );
    if (!candidateProfile) {
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
    const companyProfile = await this.companyProfileRepo.findbyUserId(
      job?.companyId
    );

    // fetch past recent 5 review on company review
    const companyReviews = await this.companyReviewRepo.findByCompanyId(
      job.companyId
    );
    const reviewText = companyReviews
      .map((r) => r.reviewText)
      .slice(0, 5)
      .join(' | ');
    const feedbackTags = Array.from(
      new Set(companyReviews.flatMap((r) => r.tags || []))
    );
    const companyData = {
      companyName: companyProfile?.companyName || 0,
      averageRating: companyProfile?.averageRating || 0,
      cultureScoreAvg: companyProfile?.cultureScoreAvg || 0,
      totalReviewCount: companyProfile?.totalReviewCount || 0,
    };

    const jobMatchScore = calculateCandidateJobMatchScore(
      candidateProfile,
      job
    );

    const prompt = `
        You are an expert Ai Career Coach and workplace analyst.
        Analyse the candidate's profile against the job posting and past company insights to provide 
        personalized evaluations.

        Candidate Skills:${JSON.stringify(candidateProfile.skills)}
        Candidate Experience:${JSON.stringify(candidateProfile.experience)}

        Job Title: ${job.title}
        Job description: ${job.description}
        Job Required Skills: ${job.skills}

        Recent past 5 Company Peer reviews & insights:" ${reviewText || 'No reviews available yet.'}"
        Common Company Feedback tags: ${JSON.stringify(feedbackTags)}
        Company Internal calculated metrics: ${JSON.stringify(companyData)}
        Calculated internal system assesment Match Score:${jobMatchScore}

        Return ONLY a JSON object strictly matching this format (no markdown formatting or extra prose):
        {
            "analysisNote":"A comprehensive coaching breif explaining why this job fits the candidate, how to improve skill gaps, and an honest assessment of whether the company is good to work for based on past reviews and data."
            "strengths":["string"],
            "skillGaps":["string"],
            "interviewExpectations":["string"],
            "companyCultureAnalysis":"String analyzing work-life balance, culture, and whether it's good place based on employee reviews",
            "estimatedAcceptanceProbality":75
        }
        
    `;

    const aiModel = this.aiService.fallbackModel;
    const aiResponse = await aiModel.invoke(prompt);

    let parseJSON;
    try {
      const cleanedContent = String(aiResponse.content)
        .replace(/```json|```/g, '')
        .trim();
      parseJSON = JSON.parse(cleanedContent);
    } catch (error) {
      logger.error(
        {
          event: 'Job_Match_AiAnalysis_Parsing_ERROR',
          reason: 'Ai parsing error',
          data: aiResponse.content,
          error: error,
        },
        'Error on parsing AI match Analysis JSON output'
      );
      throw new AppError(
        CandidateMessages.AI_ANALYSIS_ERROR,
        StatusCode.INTERNAL_SERVER_ERROR,
        'AI_ANALYSIS_PARSING_ERROR'
      );
    }

    return {
      analysisNote: parseJSON.analysisNote || '',
      strengths: parseJSON.strengths || [],
      skillGaps: parseJSON.skillGaps || [],
      interviewExpectations: parseJSON.interviewExpectations || [],
      companyCultureAnalysis:
        parseJSON.companyCultureAnalysis || 'No culture data available.',
      estimatedAcceptanceProbality:
        parseJSON.estimatedAcceptanceProbality || jobMatchScore,
    };
  }
}
