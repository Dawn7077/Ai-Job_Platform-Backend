import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IChatSessionRepository } from '../../../domain/repositories/i-chat-session-repository';
import { PrismaClient } from '@prisma/client';
import { ChatSessionRequestDTO } from '../../../application/dtos/candidate/chat-session.dto';
import { ChatSessionMapper } from '../mappers/chat-session.mapper';
import { ChatSession } from '../../../domain/entities/chat-session.entity';

@injectable()
export class PrismaChatSessionRepository implements IChatSessionRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: ChatSessionRequestDTO): Promise<ChatSession> {
    const raw = await this.prisma.chatSessions.create({
      data: {
        id: data.id,
        userId: data.userId,
        title: data.title || 'New Chat',
      },
    });

    return ChatSessionMapper.toDomain(raw);
  }

  async findById(id: string): Promise<ChatSession | null> {
    const raw = await this.prisma.chatSessions.findUnique({
      where: { id },
    });

    return raw ? ChatSessionMapper.toDomain(raw) : null;
  }

  async findByUserId(userId: string): Promise<ChatSession[]> {
    const records = await this.prisma.chatSessions.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => ChatSessionMapper.toDomain(record));
  }

  async updateTitle(id: string, title: string): Promise<ChatSession> {
    const raw = await this.prisma.chatSessions.update({
      where: { id },
      data: { title },
    });
    return ChatSessionMapper.toDomain(raw);
  }
}
