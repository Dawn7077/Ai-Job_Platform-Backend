import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IMockInterviewRepository } from '../../../domain/repositories/i-mock-interview.repository';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { CompleteMockInterviewResponseDTO } from '../../dtos/candidate/start-mock-interview.dto';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { MockInterviewFeedback } from '../../../domain/entities/mock-interview.entity';
import { logger } from '../../../shared/utils/loggers.util';
import { ICompleteMockInterviewUseCase } from '../../interface/use-cases/candidate/i-complete-mock-interview-use-case';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class CompleteMockInterviewUseCase implements ICompleteMockInterviewUseCase {
  constructor(
    @inject(TYPES.IMockInterviewRepo)
    private mockInterviewRepo: IMockInterviewRepository,
    @inject(TYPES.GatewayModel) private aiGateWay: GatewayModels
  ) {}

  async execute(dto: CompleteMockInterviewResponseDTO) {
    const session = await this.mockInterviewRepo.findById(dto.sessionId);

    if (!session) {
      throw new AppError(
        CandidateMessages.MOCK_INTERVIEW_SESSION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }
    if (session.candidateId !== dto.candidateId) {
      throw new AppError(
        CandidateMessages.UNAUTHORIZED_ACCESS_TO_INTERVIEW_SESSION,
        StatusCode.FORBIDDEN,
        ErrorCode.FORBIDDEN
      );
    }

    const prompt = `Analyze the following interview transcript and evaluate the candidate's performance.
        
        Role:${session.targetRole}
        Type:${session.type}
        Transcript: ${JSON.stringify(session.transcript)}

        Return ONLY a JSON object strictly matching this schema (no codeblocks, markdown, or extra prose):
        {
            "overallScore":85,
            "communicationScore":85,
            "technicalScore":85,
            "strengths":["Clear articulation", "Structured STAR-method answers"],
            "improvements":["Elaborate more on technical metrics and system bottlenecks",],
            "summary":"Solid performance overall with clear communication."
        }
        `;

    const model = this.aiGateWay.primaryModel;
    const aiResponse = await model.invoke(prompt);
    const rawContent = String(aiResponse.content).trim();
    const cleanedContent = rawContent.replace(
      /^```(?:json)?\s*([\s\S]*?)\s*```$/,
      '$1'
    );

    let feedback: MockInterviewFeedback;
    try {
      feedback = JSON.parse(cleanedContent);
    } catch (error) {
      logger.error(
        `Error while parsing LLM feedback JSON. Raw content was: ${cleanedContent},\n${session.transcript}`
      );

      feedback = {
        overallScore: 70,
        communicationScore: 70,
        technicalScore: 70,
        strengths: ['Completed the full interview session'],
        improvements: ['Provide more details in future answers '],
        summary: 'Mock interview completed successfully.',
      };
    }

    session.completeSession(feedback);
    const updateSession = await this.mockInterviewRepo.update(session);

    return updateSession.toJSON();
  }
}
