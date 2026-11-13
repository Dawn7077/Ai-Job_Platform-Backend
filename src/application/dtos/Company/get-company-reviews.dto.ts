import { z } from 'zod';

export const GetCompanyReviewsSchema = z.object({
  companyId: z.string().min(1, 'candidate Id is required'),
});

export type GetCompanyReviewsDTO = z.infer<typeof GetCompanyReviewsSchema>;
