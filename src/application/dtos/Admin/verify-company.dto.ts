import { z } from 'zod';
import { UserRole } from '../../../shared/constants/roles.constant';

export const VerifyCompanyBodySchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  status: z.enum(['ACTIVE', 'SUSPENDED'], {
    message: 'Invalid status provided , must be active or suspended.',
  }),
  reason: z.string().optional(),
});

export type VerifyCompanyBodyDTO = z.infer<typeof VerifyCompanyBodySchema>;
