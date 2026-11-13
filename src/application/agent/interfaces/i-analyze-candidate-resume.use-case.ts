import {
  AnalyzeCandidateResumeDTO,
  AnalyzeCandidateResumeResult,
} from '../../dtos/agent/analyze-candidate-resume.dto';

export interface IAnalyzeCandidateResumeUseCase {
  execute(
    dto: AnalyzeCandidateResumeDTO
  ): Promise<AnalyzeCandidateResumeResult>;
}
