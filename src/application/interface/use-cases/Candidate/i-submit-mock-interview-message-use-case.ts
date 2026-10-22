import { MockInterviewProps } from '../../../../domain/entities/mock-interview.entity';
import { SubmitMockInterviewMessagesDTO } from '../../../dtos/candidate/start-mock-interview.dto';

export interface ISubmitMockInterviewMessageUseCase {
  execute(dto: SubmitMockInterviewMessagesDTO): Promise<{
    interviewReply: string;
    session: MockInterviewProps;
  }>;
}
