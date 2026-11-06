import { z } from 'zod';

export const SubmitCompanyReviewSchema = z.object({
  companyId: z.string().min(1, 'Company Id is required'),
  candidateId: z.string().min(1, 'Candidate Id is required'),

  overallRating: z.number().min(1, 'Overall Rating is required').max(5),
  interviewRating: z.number().min(1, 'interview Rating is required').max(5),
  cultureRating: z.number().min(1, 'culture Rating is required').max(5),
  communicationRating: z
    .number()
    .min(1, 'communication Rating is required')
    .max(5),
  tags: z.array(z.string()).optional(),
  reviewText: z.string().min(1, 'Review Textis required'),
});

export type SubmitCompanyReviewDTO = z.infer<typeof SubmitCompanyReviewSchema>;
