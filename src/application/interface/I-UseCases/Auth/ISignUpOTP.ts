import { SendSignUpOTPRequestDTO, SendSignUpOTPResponseDTO } from "../../../dtos/Auth/sigup.dto";

export interface ISignUpOTP{
    execute(dto:SendSignUpOTPRequestDTO): Promise<SendSignUpOTPResponseDTO>
}