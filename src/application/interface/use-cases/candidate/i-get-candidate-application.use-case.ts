import {
  ApplicationDetailsResponse,
  GetCandidateApplicationRequestDTO,
} from '../../../dtos/candidate/get-all-applications.dto';
//get application details with job details
export interface IGetCandidateApplication {
  execute(
    dto: GetCandidateApplicationRequestDTO
  ): Promise<ApplicationDetailsResponse>;
}
