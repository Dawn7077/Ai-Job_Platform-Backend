import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IMockInterviewRepository } from '../../../domain/repositories/i-mock-interview.repository';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { SubmitMockInterviewMessagesDTO } from '../../dtos/candidate/start-mock-interview.dto';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { TranscriptItem } from '../../../domain/entities/mock-interview.entity';
import { ISubmitMockInterviewMessageUseCase } from '../../interface/use-cases/candidate/i-submit-mock-interview-message-use-case';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class SubmitMockInterviewMessageUseCase implements ISubmitMockInterviewMessageUseCase {
  constructor(
    @inject(TYPES.IMockInterviewRepo)
    private mockInterviewRepo: IMockInterviewRepository,
    @inject(TYPES.GatewayModel) private aiGateWay: GatewayModels
  ) {}

  async execute(dto: SubmitMockInterviewMessagesDTO) {
    console.log('updatemock hit ');

    const session = await this.mockInterviewRepo.findById(dto.sessionId);
    if (!session) {
      throw new AppError(
        CandidateMessages.MOCK_INTERVIEW_SESSION_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'NOT_FOUND'
      );
    }
    if (session.candidateId !== dto.candidateId) {
      throw new AppError(
        CandidateMessages.UNAUTHORIZED_ACCESS_TO_INTERVIEW_SESSION,
        StatusCode.FORBIDDEN,
        'FORBIDDEN'
      );
    }
    if (session.status !== 'IN_PROGRESS') {
      throw new AppError(
        CandidateMessages.SESSION_CLOSED,
        StatusCode.BAD_REQUEST,
        ErrorCode.SESSION_CLOSED
      );
    }

    session.addTranscriptEntry('candidate', dto.responseText);

    // sliding window context
    const fullTranscript = session.transcript;
    const WINDOW_SIZE = 8;

    let transcriptForLLM = fullTranscript;
    if (fullTranscript.length > WINDOW_SIZE + 1) {
      const openingMessage = fullTranscript[0] as TranscriptItem;
      const recentMessages = fullTranscript.slice(-WINDOW_SIZE);

      const uniqueRecent = recentMessages.filter(
        (msg) => msg !== openingMessage
      );
      transcriptForLLM = [openingMessage, ...uniqueRecent];
    }

    const prompt = `
        You are an expert interviewer conducting a ${session.type} mock interview for the position of
        "${session.targetRole}",
        Recent Conversation Transcript:
        ${JSON.stringify(transcriptForLLM)}

        Instructions:
        - Acknowledge the candidate's last response breifly.
        - Ask One relevant, focused follow-up question.
        - keep your response under 3-4 sentences so it sound natural when spoken out loud.
        `;

    const model = this.aiGateWay.primaryModel;
    const aiResponse = await model.invoke(prompt);
    const interviewReply = String(aiResponse.content).trim();

    session.addTranscriptEntry('interviewer', interviewReply);

    await this.mockInterviewRepo.update(session);

    return {
      interviewReply,
      session: session.toJSON(),
    };
  }
}
