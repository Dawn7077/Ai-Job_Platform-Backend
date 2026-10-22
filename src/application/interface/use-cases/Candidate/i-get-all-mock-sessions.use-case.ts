import { MockInterviewProps } from '../../../../domain/entities/mock-interview.entity';

export interface IGetAllMockInterviewSessionsUseCase {
  execute(dto: { candidateId: string }): Promise<MockInterviewProps[]>;
}
