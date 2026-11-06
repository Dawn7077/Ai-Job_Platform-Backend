import { ChatSession } from '../../../domain/entities/chat-session.entity';
import { ChatSessionRequestDTO } from '../../application/dtos/candidate/chat-session.dto';

export interface IChatSessionRepository {
  create(data: ChatSessionRequestDTO): Promise<ChatSession>;
  findById(id: string): Promise<ChatSession | null>;
  findByUserId(userId: string): Promise<ChatSession[]>;
  updateTitle(id: string, title: string): Promise<ChatSession>;
}
