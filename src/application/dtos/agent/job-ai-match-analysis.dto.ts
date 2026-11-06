import { z } from 'zod';

export const JobAiMatchAnalysisSchema = z.object({
  candidateId: z.string().min(1, 'Candidate Id is required'),
  jobId: z.string().min(1, 'Job Id is required'),
});

export type JobAiMatchAnalysisDTO = z.infer<typeof JobAiMatchAnalysisSchema>;

export interface JobAiMatchAnalysisResult {
  analysisNote: string;
  strengths: string[];
  skillGaps: string[];
  interviewExpectations: string[];
  companyCultureAnalysis: string;
  estimatedAcceptanceProbality: number;
}
