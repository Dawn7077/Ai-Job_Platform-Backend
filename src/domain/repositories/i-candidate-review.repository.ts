import { CandidateReview } from '../entities/candidate-review.entity';

export interface updateCandidateProfileInternalDTO {
  candidateId: string;
  metrics: {
    internalTechScoreAvg?: number;
    internalCultureScoreAvg?: number;
    internalCommScoreAvg?: number;
    endorsementCount?: number;
  };
}

export interface ICandidateReviewRepository {
  create(review: CandidateReview): Promise<CandidateReview>;
  findById(id: string): Promise<CandidateReview | null>;
  findByCandidateAndCompany(
    candidateId: string,
    companyId: string
  ): Promise<CandidateReview | null>;
  findByCandidateId(candidateId: string): Promise<CandidateReview[]>;
  findByCompanyId(companyId: string): Promise<CandidateReview[]>;
  updateCandidateProfileInternal(
    dto: updateCandidateProfileInternalDTO
  ): Promise<void>;
}
