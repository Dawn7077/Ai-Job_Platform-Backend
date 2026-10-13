import { GetUploadResumeURLRequestDTO, GetUploadResumeURLResponsetDTO } from "../../../dtos/Candidate/get-upload-resume-url.dto";

export interface IGetUploadResumeUrlUseCase{
    execute(dto:GetUploadResumeURLRequestDTO): Promise<GetUploadResumeURLResponsetDTO>
}