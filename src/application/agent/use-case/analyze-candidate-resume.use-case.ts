import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IJobRepository } from '../../../domain/repositories/i-job.repository';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { ICandidateReviewRepository } from '../../../domain/repositories/i-candidate-review.repository';
import { IGetResumeTextUseCase } from '../interfaces/i-get-resume-text.use-case';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { logger } from '../../../shared/utils/loggers.util';
import { calculateCandidateJobMatchScore } from '../../../shared/utils/company-job-matching-util';
import { ResumeScreeningAnalyzerPrompt } from '../prompts/application-screening-analysis.prompt';
import { IAnalyzeCandidateResumeUseCase } from '../interfaces/i-analyze-candidate-resume.use-case';
import { AnalyzeCandidateResumeDTO } from '../../dtos/agent/analyze-candidate-resume.dto';

@injectable()
export class AnalyzeCandidateResumeUseCase implements IAnalyzeCandidateResumeUseCase {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository,
    @inject(TYPES.ICandidateReviewRepository)
    private candidateReviewRepo: ICandidateReviewRepository,
    @inject(TYPES.IGetResumeTextUseCase)
    private getResumeTextUseCase: IGetResumeTextUseCase,
    @inject(TYPES.GatewayModel) private aiService: GatewayModels
  ) {}

  async execute(dto: AnalyzeCandidateResumeDTO) {
    const job = await this.jobRepo.findById(dto.jobId);
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
    const candidateProfile = await this.candidateProfileRepo.findByUserId(
      dto.candidateId
    );
    if (!candidateProfile) {
      throw new AppError(
        CompanyMessages.CANDIDATE_PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'PROFILE_NOT_FOUND'
      );
    }
    let resumeText = 'No resume text available.';
    try {
      resumeText = await this.getResumeTextUseCase.execute(dto.candidateId);
    } catch (_error) {
      logger.warn(
        { candidateId: dto.candidateId },
        'Could not extract resume text, falling back to to profile data.'
      );
    }

    const matchScore = calculateCandidateJobMatchScore(candidateProfile, job);
    const candidateReviews = await this.candidateReviewRepo.findByCompanyId(
      dto.candidateId
    );

    const reviewText = candidateReviews
      .map((r) => r.comment)
      .slice(0, 5)
      .join(' | ');

    const aiModel = this.aiService.fallbackModel;
    const prompt = ResumeScreeningAnalyzerPrompt(
      job,
      candidateProfile,
      resumeText,
      reviewText,
      matchScore
    );
    const aiResponse = await aiModel.invoke(prompt);

    let parseJSON;
    try {
      const cleanedContent = String(aiResponse)
        .replace(/```json|```/g, '')
        .trim();
      parseJSON = JSON.parse(cleanedContent);
    } catch (error) {
      logger.error(
        {
          event: 'Analyze_Candidate_Resume_Parsing_ERROR',
          reason: 'Ai parsing error',
          data: aiResponse.content,
          error: error,
        },
        'Error on parsing AI Analysis Candidate & Resume JSON output'
      );
    }

    //if you need to store the feedbacks store it in candidate reviews
    //needs to store analysis so that token cost optimaization with idempotency and rerunning with new db table

    return {
      candidateId: dto.candidateId,
      jobId: dto.jobId,
      screeningVerdict: parseJSON.screeningVerdict || 'Maybe',
      matchScore: parseJSON?.matchScore ?? matchScore,
      reasoningNote: parseJSON?.reasoningNote || ',',
      strengths: parseJSON?.strengths || [],
      skillGaps: parseJSON?.skillGaps || [],
      interviewQuestions: parseJSON?.interviewQuestions || [],
      createdAt: new Date(),
    };
  }
}
