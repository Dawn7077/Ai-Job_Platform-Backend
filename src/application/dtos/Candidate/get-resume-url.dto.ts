import { z } from 'zod';

export const GetResumeUrlSchema = z.object({
  userId: z.string().min(1, 'User Id is required'),
});

export type GetResumeUrlRequestDTO = z.infer<typeof GetResumeUrlSchema>;
