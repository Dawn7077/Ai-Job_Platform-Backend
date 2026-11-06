import {
  JobAiMatchAnalysisDTO,
  JobAiMatchAnalysisResult,
} from '../../dtos/agent/job-ai-match-analysis.dto';

export interface IJobMatchAiAnalysisUseCase {
  execute(dto: JobAiMatchAnalysisDTO): Promise<JobAiMatchAnalysisResult>;
}
