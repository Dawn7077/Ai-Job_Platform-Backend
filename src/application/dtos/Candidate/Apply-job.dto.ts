import { z } from 'zod';

export const ApplyJobSchema = z.object({
  candidateId: z.string().min(1, 'candidateId is required'),
  jobId: z.string().min(1, 'Job ID is required'),
  resumeUrl: z.string().url('Invalid resume URL').optional(),
});

export type ApplyJobRequestDTO = z.infer<typeof ApplyJobSchema>;
