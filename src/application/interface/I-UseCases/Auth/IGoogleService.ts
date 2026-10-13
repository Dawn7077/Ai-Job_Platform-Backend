import { GoogleLoginRequestDTO, GoogleLoginResponseDTO } from "../../../dtos/Auth/googleLogin.dto"; 

export interface IGoogleService{
    execute(inputData:GoogleLoginRequestDTO):Promise<GoogleLoginResponseDTO>
}