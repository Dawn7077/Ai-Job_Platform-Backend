import { CompanyReview as PrismaCompanyReview } from '@prisma/client';
import { CompanyReview } from '../../../domain/entities/company-review.entity';

export class CompanyReviewMapper {
  static toDomain(raw: PrismaCompanyReview): CompanyReview {
    return new CompanyReview({
      id: raw.id,
      companyId: raw.companyId,
      candidateId: raw.candidateId,
      overallRating: raw.overallRating,
      interviewRating: raw.interviewRating,
      cultureRating: raw.cultureRating,
      communicationRating: raw.communicationRating,
      tags: (raw.tags as string[]) ?? [],
      reviewText: raw.reviewText,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
