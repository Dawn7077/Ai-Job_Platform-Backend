import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { BaseRepository } from './base.repository';
import {
  ICandidateReviewRepository,
  updateCandidateProfileInternalDTO,
} from '../../../domain/repositories/i-candidate-review.repository';
import { PrismaClient } from '@prisma/client';
import { CandidateReview } from '../../../domain/entities/candidate-review.entity';
import { CandidateReviewMapper } from '../mappers/candidate-review.mapper';

@injectable()
export class PrismaCandidateReviewRepo
  extends BaseRepository
  implements ICandidateReviewRepository
{
  constructor(
    @inject(TYPES.PrismaClient) protected readonly prisma: PrismaClient
  ) {
    super(prisma);
  }
  async create(review: CandidateReview): Promise<CandidateReview> {
    const raw = await this.prisma.candidateReview.create({
      data: {
        id: review.id,
        companyId: review.companyId,
        candidateId: review.candidateId,
        technicalScore: review.technicalScore,
        cultureScore: review.cultureScore,
        communicationScore: review.communicationScore,
        isEndorsed: review.isEndorsed,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      },
    });

    return CandidateReviewMapper.toDomain(raw);
  }

  async findById(id: string): Promise<CandidateReview | null> {
    const rawReview = await this.prisma.candidateReview.findUnique({
      where: { id },
    });
    if (!rawReview) return null;

    return CandidateReviewMapper.toDomain(rawReview);
  }

  async findByCandidateAndCompany(
    candidateId: string,
    companyId: string
  ): Promise<CandidateReview | null> {
    const rawReview = await this.prisma.candidateReview.findUnique({
      where: {
        candidate_review_unique: {
          companyId,
          candidateId,
        },
      },
    });
    if (!rawReview) return null;

    return CandidateReviewMapper.toDomain(rawReview);
  }

  async findByCandidateId(candidateId: string): Promise<CandidateReview[]> {
    const rawReviews = await this.prisma.candidateReview.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
    });

    return rawReviews.map((r) => CandidateReviewMapper.toDomain(r));
  }

  async findByCompanyId(companyId: string): Promise<CandidateReview[]> {
    const rawReviews = await this.prisma.candidateReview.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });

    return rawReviews.map((r) => CandidateReviewMapper.toDomain(r));
  }

  async updateCandidateProfileInternal(
    dto: updateCandidateProfileInternalDTO
  ): Promise<void> {
    await this.prisma.candidateProfile.update({
      where: { id: dto.candidateId },
      data: {
        internalTechScoreAvg: dto.metrics.internalTechScoreAvg,
        internalCultureScoreAvg: dto.metrics.internalCultureScoreAvg,
        internalCommScoreAvg: dto.metrics.internalCommScoreAvg,
        endorsementCount: dto.metrics.endorsementCount,
      },
    });
  }
}
