import { MockInterview } from '../entities/mock-interview.entity';

export interface IMockInterviewRepository {
  create(mockInterviewRaw: MockInterview): Promise<MockInterview>;
  findById(id: string): Promise<MockInterview | null>;
  findByCandidateId(candidateId: string): Promise<MockInterview[]>;
  update(mockInterview: MockInterview): Promise<MockInterview>;
}
