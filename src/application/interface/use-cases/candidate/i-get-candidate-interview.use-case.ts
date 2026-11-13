import { Interview } from '../../../../domain/entities/interview.entity';

export interface IGetCandidateInterviewUC {
  execute(candidateId: string): Promise<Interview[]>;
}
