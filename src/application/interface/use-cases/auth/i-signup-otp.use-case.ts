import {
  SendSignUpOTPRequestDTO,
  SendSignUpOTPResponseDTO,
} from '../../../dtos/auth/signup.dto';

export interface ISignUpOTP {
  execute(dto: SendSignUpOTPRequestDTO): Promise<SendSignUpOTPResponseDTO>;
}
