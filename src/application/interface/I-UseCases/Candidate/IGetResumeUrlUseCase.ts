import { GetResumeUrlRequestDTO } from "../../../dtos/Candidate/Get-ResumeUrl.dto";

export interface IGetResumeUrlUseCase{
    execute(dto:GetResumeUrlRequestDTO): Promise<string>
}