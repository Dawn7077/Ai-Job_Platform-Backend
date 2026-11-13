import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICompanyReviewRepository } from '../../../domain/repositories/i-company-review-repository';
import { GetCompanyReviewsDTO } from '../../dtos/company/get-company-reviews.dto';
import { IGetCompanyReviewsUseCase } from '../../interface/use-cases/company/i-get-company-reviews.use-case';

@injectable()
export class GetCompanyReviewsUseCase implements IGetCompanyReviewsUseCase {
  constructor(
    @inject(TYPES.ICompanyReviewRepository)
    private companyReviewRepo: ICompanyReviewRepository
  ) {}

  async execute(dto: GetCompanyReviewsDTO) {
    const reviews = await this.companyReviewRepo.findByCompanyId(dto.companyId);
    return reviews;
  }
}
