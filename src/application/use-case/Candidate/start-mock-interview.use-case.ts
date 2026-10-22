import { inject, injectable } from 'inversify';
import { MockInterview } from '../../../domain/entities/mock-interview.entity';
import { IMockInterviewRepository } from '../../../domain/repositories/i-mock-interview.repository';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { TYPES } from '../../../di/types';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { CreateMockInterviewDTO } from '../../dtos/candidate/start-mock-interview.dto';
import { IStartMockInterviewUseCase } from '../../interface/use-cases/candidate/i-start-mock-interview-use-case';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class StartMockInterviewUseCase implements IStartMockInterviewUseCase {
  constructor(
    @inject(TYPES.IMockInterviewRepo)
    private mockRepo: IMockInterviewRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private profileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: CreateMockInterviewDTO) {
    const profile = await this.profileRepo.findByUserId(dto.candidateId);
    if (!profile) {
      throw new AppError(
        CandidateMessages.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NOT_FOUND
      );
    }

    const initialGreeting = `Hello ${profile.firstName}! Welcome to your ${dto.type || 'BEHAVIOUR'} mock interview 
        for the ${dto.targetRole} role.\n Whenever you're ready, please briefly introduce yourself and share a bit about your background.`;

    const mockInterview = new MockInterview({
      id: crypto.randomUUID(),
      candidateId: dto.candidateId,
      jobId: dto.jobId || null,
      targetRole: dto.targetRole,
      type: dto.type || 'BEHAVIOUR',
      status: 'IN_PROGRESS',
      transcript: [
        {
          role: 'interviewer',
          text: initialGreeting,
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    });

    const savedSession = await this.mockRepo.create(mockInterview);

    return {
      session: savedSession.toJSON(),
      message: initialGreeting,
    };
  }
}
