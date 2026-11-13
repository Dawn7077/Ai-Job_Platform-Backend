import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';
import { IGetAllCandidatesUseCase } from '../../interface/use-cases/company/i-get=all-candidates.use-case';
import { GetCandidatesCompanyIdDTO } from '../../dtos/company/get-candidate.dto';

@injectable()
export class GetAllCandidatesUseCase implements IGetAllCandidatesUseCase {
  constructor(
    @inject(TYPES.ICandidateProfileRepo)
    private profileRepo: ICandidateProfileRepository
  ) {}

  async execute(params: GetCandidatesCompanyIdDTO) {
    const results = await this.profileRepo.findCandidates(params);
    return {
      total: results.total,
      page: results.page,
      totalPages: results.totalPages,
      candidates: results.candidates.map((item) => ({
        ...item.profile.toJSON(),
        email: item.email,
      })),
    };
  }
}
