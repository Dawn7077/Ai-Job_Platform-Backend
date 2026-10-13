import { GetUploadResumeURLRequestDTO, GetUploadResumeURLResponsetDTO } from "../../../dtos/Candidate/get-upload-resumeURL.dto";

export interface IGetUploadResumeUrlUseCase{
    execute(dto:GetUploadResumeURLRequestDTO): Promise<GetUploadResumeURLResponsetDTO>
}