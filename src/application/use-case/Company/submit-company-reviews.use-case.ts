import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICompanyReviewRepository } from '../../../domain/repositories/i-company-review-repository';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import { CompanyReview } from '../../../domain/entities/company-review.entity';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CandidateMessages } from '../../../shared/constants/candidate-message.constants';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { ISubmitCompanyReviewUsecase } from '../../interface/use-cases/company/i-submit-company-review.use-case';
import { SubmitCompanyReviewDTO } from '../../dtos/company/submit-company-review.dto';

// used by candidate to submit reviews on company which will
// create the review and update the internal score metrics
@injectable()
export class SubmitCompanyReviewUsecase implements ISubmitCompanyReviewUsecase {
  constructor(
    @inject(TYPES.ICompanyReviewRepository)
    private reviewRepo: ICompanyReviewRepository,
    @inject(TYPES.ICompanyProfileRepo)
    private profileRepo: ICompanyProfileRepo
  ) {}

  async execute(dto: SubmitCompanyReviewDTO): Promise<CompanyReview> {
    const profile = await this.profileRepo.findById(dto.companyId);
    if (!profile) {
      throw new AppError(
        CandidateMessages.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'PROFILE_NOT_FOUND'
      );
    }

    const newReview = new CompanyReview({
      companyId: dto.companyId,
      candidateId: dto.candidateId,
      overallRating: dto.overallRating,
      interviewRating: dto.interviewRating,
      cultureRating: dto.cultureRating,
      communicationRating: dto.communicationRating,
      tags: dto.tags ?? [],
      reviewText: dto.reviewText,
    });

    const savedReview = await this.reviewRepo.create(newReview);

    //create a new review and recalculate the company profile internal data

    const allReview = await this.reviewRepo.findByCompanyId(dto.companyId);
    const totalReviewCount = allReview.length;

    if (totalReviewCount > 0) {
      const sumOverall = allReview.reduce((acc, r) => acc + r.overallRating, 0);
      const sumInterview = allReview.reduce(
        (acc, r) => acc + r.interviewRating,
        0
      );
      const sumCulture = allReview.reduce((acc, r) => acc + r.cultureRating, 0);
      const sumComm = allReview.reduce(
        (acc, r) => acc + r.communicationRating,
        0
      );

      const metrics = {
        averageRating: Number((sumOverall / totalReviewCount).toFixed(2)),
        totalReviewCount: totalReviewCount,
        interviewScoreAvg: Number((sumInterview / totalReviewCount).toFixed(2)),
        cultureScoreAvg: Number((sumCulture / totalReviewCount).toFixed(2)),
        communicationScoreAvg: Number((sumComm / totalReviewCount).toFixed(2)),
      };

      await this.reviewRepo.updateCompanyProfileInternal({
        companyId: dto.companyId,
        metrics,
      });
    }

    return savedReview;
  }
}
