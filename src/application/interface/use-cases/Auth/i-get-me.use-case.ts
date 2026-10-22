import { User } from '../../../../domain/entities/user.entity';
import { GetMeRequestDTO } from '../../../dtos/auth/get-me.dto';

export interface IGetMe {
  execute(dto: GetMeRequestDTO): Promise<User>;
}
