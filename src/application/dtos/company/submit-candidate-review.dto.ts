import { z } from 'zod';

export const SubmitCandidateReviewSchema = z.object({
  companyId: z.string().min(1, 'Company Id is required'),
  candidateId: z.string().min(1, 'Candidate Id is required'),
  technicalScore: z.number().min(1, 'Technical Score is required').max(5),
  cultureScore: z.number().min(1, 'culture Rating is required').max(5),
  communicationScore: z
    .number()
    .min(1, 'Communication Rating is required')
    .max(5),
  isEndorsed: z.boolean().default(false),
  comment: z.string().min(1, 'Comments is required'),
});

export type SubmitCandidateReviewDTO = z.infer<
  typeof SubmitCandidateReviewSchema
>;
