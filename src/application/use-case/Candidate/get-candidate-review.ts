import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateReviewRepository } from '../../../domain/repositories/i-candidate-review.repository';
import { IGetCandidateReviewsUseCase } from '../../interface/use-cases/candidate/i-get-candidate-reviews.use-case';
import { GetCandidateReviewsDTO } from '../../dtos/candidate/get-reviews.dto';

@injectable()
export class GetCandidateReviewsUseCase implements IGetCandidateReviewsUseCase {
  constructor(
    @inject(TYPES.ICandidateReviewRepository)
    private candidateReviewRepo: ICandidateReviewRepository
  ) {}

  async execute(dto: GetCandidateReviewsDTO) {
    const reviews = await this.candidateReviewRepo.findByCandidateId(
      dto.candidateId
    );
    return reviews;
  }
}
