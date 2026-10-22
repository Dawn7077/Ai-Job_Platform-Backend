import { User } from '../../../../domain/entities/user.entity';

export interface IGetPendingUsers {
  execute(): Promise<User[]>;
}
