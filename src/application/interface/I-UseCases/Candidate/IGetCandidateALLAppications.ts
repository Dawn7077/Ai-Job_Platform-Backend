import { Application } from "../../../../domain/entities/Application";
import { GetAllApplicationsRequestDTO_Cand } from "../../../dtos/Candidate/Get-all-applications.dto";

export interface IGetCandidateALLAppications{
    execute( dto:GetAllApplicationsRequestDTO_Cand):Promise<Application[]>
}