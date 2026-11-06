import { ChatSessions as PrismaChatSession } from '@prisma/client';
import { ChatSession } from '../../../domain/entities/chat-session.entity';

export class ChatSessionMapper {
  static toDomain(raw: PrismaChatSession): ChatSession {
    return new ChatSession({
      id: raw.id,
      userId: raw.userId,
      title: raw.title,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
  // why we need the persistence
  //   static toPersistence(domain: ChatSession) {
  //     return {
  //       id: domain.id,
  //       userId: domain.userId,
  //       title: domain.title,
  //       createdAt: domain.createdAt,
  //       udpatedAt: domain.updatedAt,
  //     };
  //   }
}
