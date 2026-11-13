import { CandidateReview as PrismaCandidateReview } from '@prisma/client';
import { CandidateReview } from '../../../domain/entities/candidate-review.entity';

export class CandidateReviewMapper {
  static toDomain(raw: PrismaCandidateReview): CandidateReview {
    return new CandidateReview({
      id: raw.id,
      companyId: raw.companyId,
      candidateId: raw.candidateId,
      technicalScore: raw.technicalScore,
      cultureScore: raw.cultureScore,
      communicationScore: raw.communicationScore,
      isEndorsed: raw.isEndorsed,
      comment: raw.comment,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
