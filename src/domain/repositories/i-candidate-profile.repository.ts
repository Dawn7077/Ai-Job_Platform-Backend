import {
  CandidateProfile,
  CandidateProfileProps,
} from '../entities/candidate-profile.entity';
import { User } from '../entities/user.entity';

export interface CandidateFilterQueryParams {
  page: number;
  limit: number;
  search?: string;
  location?: string;
}
export interface CandidateWithUserResult {
  profile: CandidateProfile;
  email: string;
}

export interface PaginatedCandidateProfiles {
  candidates: CandidateWithUserResult[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ICandidateProfileRepository {
  findByUserId(userId: string): Promise<CandidateProfile | null>;
  upsertProfile(
    userId: string,
    data: Partial<CandidateProfileProps>
  ): Promise<CandidateProfile>;
  updateResumeKey(userId: string, resumeKey: string): Promise<CandidateProfile>;
  findCandidates(
    params: CandidateFilterQueryParams
  ): Promise<PaginatedCandidateProfiles>;
}
