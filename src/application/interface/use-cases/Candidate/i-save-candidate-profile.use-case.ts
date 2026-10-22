import {
  CandidateProfile,
  CandidateProfileProps,
} from '../../../../domain/entities/candidate-profile.entity';
import { SaveCandidateProfileRequestDTO } from '../../../dtos/candidate/save-profile.dto';

export interface ISaveCandidateProfile {
  execute(dto: SaveCandidateProfileRequestDTO): Promise<CandidateProfile>;
}
