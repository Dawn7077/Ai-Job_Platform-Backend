import { z } from 'zod';

export const AnalystChatSchema = z.object({
  userId: z.string().min(1, 'User Id is required'),
  message: z.string().min(1, 'Message is required'),
  threadId: z.string().optional(),
});

export type AnalystChatRequestDTO = z.infer<typeof AnalystChatSchema>;
