import { CompanyReview } from '../../../../domain/entities/company-review.entity';
import { SubmitCompanyReviewDTO } from '../../../dtos/company/submit-company-review.dto';

export interface ISubmitCompanyReviewUsecase {
  execute(dto: SubmitCompanyReviewDTO): Promise<CompanyReview>;
}
