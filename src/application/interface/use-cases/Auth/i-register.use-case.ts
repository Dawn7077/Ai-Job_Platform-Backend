import { User } from '../../../../domain/entities/user.entity';
import { RegisterRequestDTO } from '../../../dtos/auth/register.dto';

export interface IRegisterUser {
  execute(dto: RegisterRequestDTO): Promise<
    | {
        message: string;
        requiresApproval: boolean;
        user: User;
        accessToken?: never;
        refreshToken?: never;
      }
    | {
        accessToken: string;
        refreshToken: string;
        user: User;
      }
  >;
}
