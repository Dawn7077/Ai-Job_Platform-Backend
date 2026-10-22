import {
  GoogleLoginRequestDTO,
  GoogleLoginResponseDTO,
} from '../../../dtos/auth/google-login.dto';

export interface IGoogleService {
  execute(inputData: GoogleLoginRequestDTO): Promise<GoogleLoginResponseDTO>;
}
