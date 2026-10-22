import {
  ResetPasswordRequestDTO,
  ResetPasswordResponseDTO,
} from '../../../dtos/auth/reset-password.dto';

export interface IResetPasswordUseCase {
  execute(dto: ResetPasswordRequestDTO): Promise<ResetPasswordResponseDTO>;
}
