import { GetResumeUrlRequestDTO } from "../../../dtos/Candidate/get-resume-url.dto";

export interface IGetResumeUrlUseCase{
    execute(dto:GetResumeUrlRequestDTO): Promise<string>
}