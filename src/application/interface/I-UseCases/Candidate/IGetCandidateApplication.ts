import { ApplicationDetailsResponse, GetCandidateApplicationRequestDTO } from "../../../dtos/Candidate/Get-all-applications.dto"; 

export interface IGetCandidateApplication{
    execute(dto:GetCandidateApplicationRequestDTO): Promise<ApplicationDetailsResponse>
}


