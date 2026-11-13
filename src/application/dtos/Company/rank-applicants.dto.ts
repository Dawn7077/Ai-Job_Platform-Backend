import { z } from 'zod';

export const RankApplicantsSchema = z.object({
  jobId: z.string().min(1, 'Job Id is required'),
  companyId: z.string().min(1, 'company Id is required'),
  limit: z.number().optional(),
});

export type RankApplicantsDTO = z.infer<typeof RankApplicantsSchema>;
