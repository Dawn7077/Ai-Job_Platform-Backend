import { MockInterview as PrismaMockInterview } from '@prisma/client';
import {
  MockInterview,
  MockInterviewFeedback,
  MockInterviewStatus,
  MockInterviewType,
  TranscriptItem,
} from '../../../domain/entities/mock-interview.entity';

export class MockInterviewMapper {
  static toDomain(record: PrismaMockInterview) {
    const rawtranscript = (record.transcript as unknown as any[]) || [];
    const transcript: TranscriptItem[] = rawtranscript.map((item) => ({
      role: item.role,
      text: item.text,
      timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
    }));

    return new MockInterview({
      id: record.id,
      candidateId: record.candidateId,
      jobId: record.jobId,
      type: record.type as MockInterviewType,
      targetRole: record.targetRole,
      status: record.status as MockInterviewStatus,
      transcript: transcript,
      // transcript:(record.transcript as unknown as TranscriptItem[])??[],
      feedback: (record.feedback as unknown as MockInterviewFeedback) ?? null,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
