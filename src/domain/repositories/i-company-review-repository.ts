import { CompanyReview } from '../entities/company-review.entity';

export interface updateCompanyProfileInternalDTO {
  companyId: string;
  metrics: {
    averageRating: number;
    totalReviewCount: number;
    cultureScoreAvg: number;
    interviewScoreAvg: number;
    communicationScoreAvg: number;
  };
}

export interface ICompanyReviewRepository {
  create(review: CompanyReview): Promise<CompanyReview>;
  findById(id: string): Promise<CompanyReview | null>;
  findByCompanyId(companyId: string): Promise<CompanyReview[]>;
  updateCompanyProfileInternal(
    dto: updateCompanyProfileInternalDTO
  ): Promise<void>;
  // updateCompanyProfileInternal(
  //   companyId: string,
  //   metrics: {
  //     averageRating: number;
  //     totalReviewCount: number;
  //     cultureScoreAvg: number;
  //     communicationScoreAvg: number;
  //   }
  // ): Promise<void>;
}
