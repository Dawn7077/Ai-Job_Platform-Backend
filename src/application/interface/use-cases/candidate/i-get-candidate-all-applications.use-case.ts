import { Application } from '../../../../domain/entities/application.entity';
import { GetAllApplicationsRequestDTO_Cand } from '../../../dtos/candidate/get-all-applications.dto';

export interface IGetCandidateALLAppications {
  execute(dto: GetAllApplicationsRequestDTO_Cand): Promise<Application[]>;
}
