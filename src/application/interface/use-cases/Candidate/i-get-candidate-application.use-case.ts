import { ApplicationDetailsResponse, GetCandidateApplicationRequestDTO } from "../../../dtos/Candidate/get-all-applications.dto"; 
//get application details with job details
export interface IGetCandidateApplication{
    execute(dto:GetCandidateApplicationRequestDTO): Promise<ApplicationDetailsResponse>
}


