import { ApplicationDetailsResponse } from "../../../use-case/Candidate/GetCandidateApplication";

export interface IGetCandidateApplication{
    execute(candidateId: string, applicationId: string): Promise<ApplicationDetailsResponse>
}