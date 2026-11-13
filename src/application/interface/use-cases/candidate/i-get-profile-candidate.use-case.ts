import { CandidateProfile } from '../../../../domain/entities/candidate-profile.entity';
import { GetProfileCandidateRequestDTO } from '../../../dtos/candidate/get-profile-candidate.dto';

export interface IGetProfileCandidateUseCase {
  execute(dto: GetProfileCandidateRequestDTO): Promise<CandidateProfile>;
}
