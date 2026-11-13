import { z } from 'zod';

export const GetThreadMessagesSchema = z.object({
  threadId: z.string().min(1, 'thread Id is required'),
});

export type GetThreadMessagesDTO = z.infer<typeof GetThreadMessagesSchema>;
