import { CandidateReview } from '../entities/candidate-review.entity';

export interface ICandidateReviewRepository {
  create(review: CandidateReview): Promise<CandidateReview>;
  findById(id: string): Promise<CandidateReview | null>;
}
