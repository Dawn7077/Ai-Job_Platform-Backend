import { GetThreadMessagesDTO } from '../../../dtos/candidate/get-thread-messages.dto';

export interface IGetThreadMessagesUseCase {
  execute(dto: GetThreadMessagesDTO): Promise<any>;
}
