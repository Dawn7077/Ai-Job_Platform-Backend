import { ResetPasswordRequestDTO, ResetPasswordResponseDTO } from "../../../dtos/Auth/reset-password.dto";

export interface IResetPasswordUseCase{
    execute(dto:ResetPasswordRequestDTO):Promise<ResetPasswordResponseDTO>
}