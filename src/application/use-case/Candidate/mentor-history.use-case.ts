import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IMentorAgent } from '../../agent/interfaces/i-mentor-agent.interface';
import { GetThreadMessagesDTO } from '../../dtos/candidate/get-thread-messages.dto';
import { IGetThreadMessagesUseCase } from '../../interface/use-cases/candidate/i-get-thread-messages.use-case';

@injectable()
export class GetThreadMessagesUseCase implements IGetThreadMessagesUseCase {
  constructor(
    @inject(TYPES.IMentorAgent)
    private mentorAgent: IMentorAgent
  ) {}

  async execute(dto: GetThreadMessagesDTO) {
    return await this.mentorAgent.getThreadMessages(dto.threadId);
  }
}
