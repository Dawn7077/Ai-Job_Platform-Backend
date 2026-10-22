import { MockInterviewProps } from '../../../../domain/entities/mock-interview.entity';
import { CreateMockInterviewDTO } from '../../../dtos/candidate/start-mock-interview.dto';

export interface IStartMockInterviewUseCase {
  execute(dto: CreateMockInterviewDTO): Promise<{
    session: MockInterviewProps;
    message: string;
  }>;
}
