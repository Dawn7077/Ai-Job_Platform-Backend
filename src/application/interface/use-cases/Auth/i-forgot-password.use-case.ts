import {
  ForgotPasswordRequestDTO,
  ForgotPasswordResponseDTO,
} from '../../../dtos/auth/forgot-password.dto';

export interface IForgotPasswordUseCase {
  execute(dto: ForgotPasswordRequestDTO): Promise<ForgotPasswordResponseDTO>;
}
