import { inject, injectable } from 'inversify';
import { IMockInterviewRepository } from '../../../domain/repositories/i-mock-interview.repository';
import { BaseRepository } from './base.repository';
import { TYPES } from '../../../di/types';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  MockInterview,
  MockInterviewStatus,
  MockInterviewType,
} from '../../../domain/entities/mock-interview.entity';
import { MockInterviewMapper } from '../mappers/mock-interview.mapper';

@injectable()
export class PrismaMockInterview
  extends BaseRepository
  implements IMockInterviewRepository
{
  constructor(
    @inject(TYPES.PrismaClient) protected readonly prisma: PrismaClient
  ) {
    super(prisma);
  }

  async create(mockInterview: MockInterview): Promise<MockInterview> {
    const raw = mockInterview.toJSON();

    const record = await this.prisma.mockInterview.create({
      data: {
        id: raw.id,
        candidateId: raw.candidateId,
        jobId: raw.jobId,
        type: raw.type as MockInterviewType,
        targetRole: raw.targetRole,
        status: raw.status as MockInterviewStatus,
        transcript: raw.transcript as unknown as Prisma.InputJsonValue,
        feedback: (raw.feedback ??
          undefined) as unknown as Prisma.InputJsonValue,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
    });

    return MockInterviewMapper.toDomain(record);
  }

  async findById(id: string): Promise<MockInterview | null> {
    const record = await this.prisma.mockInterview.findUnique({
      where: { id },
    });
    if (!record) return null;
    return MockInterviewMapper.toDomain(record);
  }

  async findByCandidateId(candidateId: string): Promise<MockInterview[]> {
    const records = await this.prisma.mockInterview.findMany({
      where: { candidateId: candidateId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => MockInterviewMapper.toDomain(record));
  }

  async update(mockInterview: MockInterview): Promise<MockInterview> {
    const raw = mockInterview.toJSON();
    const updateRecord = await this.prisma.mockInterview.update({
      where: { id: raw.id },
      data: {
        status: raw.status as MockInterviewStatus,
        transcript: raw.transcript as unknown as Prisma.InputJsonValue,
        feedback: (raw.feedback ??
          undefined) as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
    });

    return MockInterviewMapper.toDomain(updateRecord);
  }
}
