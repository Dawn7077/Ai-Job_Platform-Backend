import { GetResumeUrlRequestDTO } from '../../../dtos/candidate/get-resume-url.dto';

export interface IGetResumeUrlUseCase {
  execute(dto: GetResumeUrlRequestDTO): Promise<string>;
}
