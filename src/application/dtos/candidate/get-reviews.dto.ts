import { z } from 'zod';

export const GetCandidateReviewsSchema = z.object({
  candidateId: z.string().min(1, 'candidate Id is required'),
});

export type GetCandidateReviewsDTO = z.infer<typeof GetCandidateReviewsSchema>;
