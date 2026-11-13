import { MockInterviewProps } from '../../../../domain/entities/mock-interview.entity';
import { CompleteMockInterviewResponseDTO } from '../../../dtos/candidate/start-mock-interview.dto';

export interface ICompleteMockInterviewUseCase {
  execute(dto: CompleteMockInterviewResponseDTO): Promise<MockInterviewProps>;
}
