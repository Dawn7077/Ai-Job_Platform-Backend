import { z } from 'zod';

export const CalculateJobMatchSchema = z.object({
  candidateId: z.string().min(1, 'candidate ID is required'),
  jobId: z.string().min(1, 'job ID is required'),
});

export type CalculateJobMatchDTO = z.infer<typeof CalculateJobMatchSchema>;

export interface JobMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  companyReputationBoost: number;
}
