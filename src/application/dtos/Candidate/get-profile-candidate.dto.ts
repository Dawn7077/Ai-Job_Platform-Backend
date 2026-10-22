import { z } from 'zod';
// get profile
export const GetProfileCandidateSchema = z.object({
  userId: z.string().min(1, 'User Id is required'),
});

export type GetProfileCandidateRequestDTO = z.infer<
  typeof GetProfileCandidateSchema
>;
