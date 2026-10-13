import { ForgotPasswordRequestDTO, ForgotPasswordResponseDTO } from "../../../dtos/Auth/forgot-password.dto";

export interface IForgotPasswordUseCase{
    execute(dto:ForgotPasswordRequestDTO):Promise<ForgotPasswordResponseDTO>
}