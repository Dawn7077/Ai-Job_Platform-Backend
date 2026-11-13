import { ChatSession } from '../../../../domain/entities/chat-session.entity';
import { GetCandidateChatSessionsDTO } from '../../../dtos/candidate/get-candidate-chat-sessions.dto';

export interface IGetCandidateChatSessionsUseCase {
  execute(dto: GetCandidateChatSessionsDTO): Promise<ChatSession[]>;
}
