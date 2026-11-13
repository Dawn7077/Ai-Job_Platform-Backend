import { inject, injectable } from 'inversify';
import { Interview } from '../../../domain/entities/interview.entity';
import { IInterviewRepository } from '../../../domain/repositories/i-interview.repository';
import { TYPES } from '../../../di/types';
import { IGetCompanyInterviewUC } from '../../interface/use-cases/company/i-get-company-interviews.use-case';

@injectable()
export class GetCompanyInterviewUC implements IGetCompanyInterviewUC {
  constructor(
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepository
  ) {}
  async execute(companyId: string): Promise<Interview[]> {
    return await this.interviewRepo.findByCompanyId(companyId);
  }
}
