import { z } from 'zod';

export const AnalyzeCandidateResumeSchema = z.object({
  companyId: z.string().min(1, 'Company Id is required'),
  candidateId: z.string().min(1, 'Candidate Id is required'),
  jobId: z.string().min(1, 'Job Id is required'),
});

export type AnalyzeCandidateResumeDTO = z.infer<
  typeof AnalyzeCandidateResumeSchema
>;

export interface AnalyzeCandidateResumeResult {
  candidateId: string;
  jobId: string;
  screeningVerdict: any;
  matchScore: any;
  reasoningNote: any;
  strengths: any;
  skillGaps: any;
  interviewQuestions: any;
  createdAt: Date;
}
