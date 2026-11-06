import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IChatSessionRepository } from '../../../domain/repositories/i-chat-session-repository';
import { IGetCandidateChatSessionsUseCase } from '../../interface/use-cases/candidate/i-get-candidate-chat-sessions.use-case';
import { GetCandidateChatSessionsDTO } from '../../dtos/candidate/get-candidate-chat-sessions.dto';

@injectable()
export class GetCandidateChatSessionsUseCase implements IGetCandidateChatSessionsUseCase {
  constructor(
    @inject(TYPES.IChatSessionRepository)
    private chatSessionRepo: IChatSessionRepository
  ) {}

  async execute(dto: GetCandidateChatSessionsDTO) {
    return await this.chatSessionRepo.findByUserId(dto.userId);
  }
}
