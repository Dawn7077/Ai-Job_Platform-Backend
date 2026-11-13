import { z } from 'zod';

export const DeleteUserParamSchema = z.object({
  id: z.string().min(1, 'User Id is required'),
});

export type DeleteUserParamDTO = z.infer<typeof DeleteUserParamSchema>;
