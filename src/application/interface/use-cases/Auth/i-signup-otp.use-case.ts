import { SendSignUpOTPRequestDTO, SendSignUpOTPResponseDTO } from "../../../dtos/Auth/signup.dto";

export interface ISignUpOTP{
    execute(dto:SendSignUpOTPRequestDTO): Promise<SendSignUpOTPResponseDTO>
}