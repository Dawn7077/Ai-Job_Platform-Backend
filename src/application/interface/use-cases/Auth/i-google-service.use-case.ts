import { GoogleLoginRequestDTO, GoogleLoginResponseDTO } from "../../../dtos/Auth/google-login.dto"; 

export interface IGoogleService{
    execute(inputData:GoogleLoginRequestDTO):Promise<GoogleLoginResponseDTO>
}