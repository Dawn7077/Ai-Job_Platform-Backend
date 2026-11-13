import {
  GetUploadResumeURLRequestDTO,
  GetUploadResumeURLResponsetDTO,
} from '../../../dtos/candidate/get-upload-resume-url.dto';

export interface IGetUploadResumeUrlUseCase {
  execute(
    dto: GetUploadResumeURLRequestDTO
  ): Promise<GetUploadResumeURLResponsetDTO>;
}
