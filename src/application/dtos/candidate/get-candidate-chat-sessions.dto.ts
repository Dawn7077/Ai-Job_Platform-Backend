import { z } from 'zod';

export const GetCandidateChatSessionsSchema = z.object({
  userId: z.string().min(1, 'User Id is required'),
});

export type GetCandidateChatSessionsDTO = z.infer<
  typeof GetCandidateChatSessionsSchema
>;
