import { CandidateReview } from '@prisma/client';
import { SubmitCandidateReviewDTO } from '../../../dtos/company/submit-candidate-review.dto';

export interface ISubmitCandidateReviewUseCase {
  execute(dto: SubmitCandidateReviewDTO): Promise<CandidateReview>;
}
