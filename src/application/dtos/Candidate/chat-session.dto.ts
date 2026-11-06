import { z } from 'zod';

export const ChatSessionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  userId: z.string().min(1, 'User Id is required'),
  title: z.string().optional(),
});

export type ChatSessionRequestDTO = z.infer<typeof ChatSessionSchema>;
