import { CandidateReview } from '../../../../domain/entities/candidate-review.entity';
import { GetCandidateReviewsDTO } from '../../../dtos/candidate/get-reviews.dto';

export interface IGetCandidateReviewsUseCase {
  execute(dto: GetCandidateReviewsDTO): Promise<CandidateReview[]>;
}
