import { inject, injectable } from 'inversify';
import { Application } from '../../../domain/entities/application.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IGetCandidateALLAppications } from '../../interface/use-cases/candidate/i-get-candidate-all-applications.use-case';
import { TYPES } from '../../../di/types';
import { GetAllApplicationsRequestDTO_Cand } from '../../dtos/candidate/get-all-applications.dto';

@injectable()
export class GetAllAppicationsUseCase implements IGetCandidateALLAppications {
  constructor(
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository
  ) {}

  async execute(
    dto: GetAllApplicationsRequestDTO_Cand
  ): Promise<Application[]> {
    const { candidateId } = dto;
    return this.applicationRepo.findByCandidateId(candidateId);
  }
}
//get all jobapplications of a candidate
