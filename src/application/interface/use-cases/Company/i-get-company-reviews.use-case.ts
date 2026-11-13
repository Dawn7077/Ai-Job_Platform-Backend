import { CompanyReview } from '../../../../domain/entities/company-review.entity';
import { GetCompanyReviewsDTO } from '../../../dtos/company/get-company-reviews.dto';

export interface IGetCompanyReviewsUseCase {
  execute(dto: GetCompanyReviewsDTO): Promise<CompanyReview[]>;
}
