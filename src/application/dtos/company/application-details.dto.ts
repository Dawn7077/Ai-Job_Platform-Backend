import { z } from 'zod';

export const ApplicationDetailsParamSchema = z.object({
  jobId: z.string().min(1, 'Job Id is required'),
  id: z.string().min(1, 'Id is required'),
});

export type ApplicationDetailsParamDTO = z.infer<
  typeof ApplicationDetailsParamSchema
>;
