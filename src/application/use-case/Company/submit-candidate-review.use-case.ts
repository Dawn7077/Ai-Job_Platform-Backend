import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateReviewRepository } from '../../../domain/repositories/i-candidate-review.repository';
import { SubmitCandidateReviewDTO } from '../../dtos/company/submit-candidate-review.dto';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { CompanyMessages } from '../../../shared/constants/company-messages.constant';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { CandidateReview } from '../../../domain/entities/candidate-review.entity';
import { ISubmitCandidateReviewUseCase } from '../../interface/use-cases/company/i-submit-candidate-review.use-case';

//from company to candidate reviews
@injectable()
export class SubmitCandidateReviewUseCase implements ISubmitCandidateReviewUseCase {
  constructor(
    @inject(TYPES.ICandidateReviewRepository)
    private candidateReviewRepo: ICandidateReviewRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository
  ) {}

  async execute(dto: SubmitCandidateReviewDTO) {
    const candidateProfile = await this.candidateProfileRepo.findByUserId(
      dto.candidateId
    );

    if (!candidateProfile) {
      throw new AppError(
        CompanyMessages.CANDIDATE_PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
        'CANDIDATE_PROFILE_NOT_FOUND'
      );
    }

    const review = new CandidateReview({
      candidateId: dto.candidateId,
      companyId: dto.companyId,
      technicalScore: dto.technicalScore,
      cultureScore: dto.cultureScore,
      communicationScore: dto.communicationScore,
      isEndorsed: dto.isEndorsed,
      comment: dto.comment,
    });

    const savedReview = await this.candidateReviewRepo.create(review);

    const allReview = await this.candidateReviewRepo.findByCandidateId(
      dto.candidateId
    );

    const totalReviewCount = allReview.length;

    if (totalReviewCount > 0) {
      const sumTechnicalScr = allReview.reduce(
        (acc, r) => acc + r.technicalScore,
        0
      );
      const sumcultureScr = allReview.reduce(
        (acc, r) => acc + r.cultureScore,
        0
      );
      const sumCommScore = allReview.reduce(
        (acc, r) => acc + r.communicationScore,
        0
      );
      const metrics = {
        internalTechScoreAvg: Number(
          (sumTechnicalScr / totalReviewCount).toFixed(2)
        ),
        internalCultureScoreAvg: Number(
          (sumcultureScr / totalReviewCount).toFixed(2)
        ),
        internalCommScoreAvg: Number(
          (sumCommScore / totalReviewCount).toFixed(2)
        ),
        endorsementCount: dto.isEndorsed
          ? candidateProfile.endorsementCount + 1
          : candidateProfile.endorsementCount,
      };

      await this.candidateReviewRepo.updateCandidateProfileInternal({
        candidateId: dto.candidateId,
        metrics: metrics,
      });
    }

    return savedReview;
  }
}
