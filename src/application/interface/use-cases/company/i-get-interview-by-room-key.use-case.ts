import { Interview } from '../../../../domain/entities/interview.entity';
import { GetInterviewByRoomKeyParamDTO } from '../../../dtos/interview/get-by-room-key.dto';

export interface IGetInterviewByRoomKeyUC {
  execute(dto: GetInterviewByRoomKeyParamDTO): Promise<Interview>;
}
