import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import {
  ICompanyReviewRepository,
  updateCompanyProfileInternalDTO,
} from '../../../domain/repositories/i-company-review-repository';
import { BaseRepository } from './base.repository';
import { CompanyReview } from '../../../domain/entities/company-review.entity';
import { PrismaClient } from '@prisma/client';
import { CompanyReviewMapper } from '../mappers/company-review.mapper';

@injectable()
export class PrismaCompanyReviewRepo
  extends BaseRepository
  implements ICompanyReviewRepository
{
  constructor(
    @inject(TYPES.PrismaClient) protected readonly prisma: PrismaClient
  ) {
    super(prisma);
  }
  async create(review: CompanyReview): Promise<CompanyReview> {
    const raw = await this.prisma.companyReview.create({
      data: {
        id: review.id,
        companyId: review.companyId,
        candidateId: review.candidateId,
        overallRating: review.overallRating,
        interviewRating: review.interviewRating,
        cultureRating: review.cultureRating,
        communicationRating: review.communicationRating,
        tags: review.tags,
        reviewText: review.reviewText,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });

    return CompanyReviewMapper.toDomain(raw);
  }

  async findById(id: string): Promise<CompanyReview | null> {
    const rawReview = await this.prisma.companyReview.findUnique({
      where: { id },
    });
    if (!rawReview) return null;

    return CompanyReviewMapper.toDomain(rawReview);
  }

  async findByCompanyId(companyId: string): Promise<CompanyReview[]> {
    const rawReviews = await this.prisma.companyReview.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
    return rawReviews.map((r) => CompanyReviewMapper.toDomain(r));
  }

  async updateCompanyProfileInternal(
    dto: updateCompanyProfileInternalDTO
  ): Promise<void> {
    await this.prisma.companyProfile.update({
      where: { id: dto.companyId },
      data: {
        averageRating: dto.metrics.averageRating,
        totalReviewCount: dto.metrics.totalReviewCount,
        interviewScoreAvg: dto.metrics.interviewScoreAvg,
        cultureScoreAvg: dto.metrics.cultureScoreAvg,
        communicationScoreAvg: dto.metrics.communicationScoreAvg,
      },
    });
  }
}
