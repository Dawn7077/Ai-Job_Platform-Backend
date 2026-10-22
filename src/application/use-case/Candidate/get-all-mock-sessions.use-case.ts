import { inject, injectable } from 'inversify';
import { IMockInterviewRepository } from '../../../domain/repositories/i-mock-interview.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetAllMockInterviewSessionsUseCase } from '../../interface/use-cases/candidate/i-get-all-mock-sessions.use-case';
import { GetMockInterviewSessionsDTO } from '../../dtos/candidate/start-mock-interview.dto';
import { TYPES } from '../../../di/types';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetAllMockInterviewSessionsUseCase implements IGetAllMockInterviewSessionsUseCase {
  constructor(
    @inject(TYPES.IMockInterviewRepo)
    private mockRepo: IMockInterviewRepository
  ) {}

  async execute(dto: GetMockInterviewSessionsDTO) {
    const sessions = await this.mockRepo.findByCandidateId(dto.candidateId);
    if (!sessions || sessions.length < 1) {
      throw new AppError(
        CandidateMessages.NO_SESSIONS_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.NO_SESSIONS_FOUND
      );
    }
    const sessionsData = sessions.map((session) => session.toJSON());
    return sessionsData;
  }
}
