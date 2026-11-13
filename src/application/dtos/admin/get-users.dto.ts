import { z } from 'zod';
import { UserRole, UserStatus } from '../../../shared/constants/roles.constant';

export const GetUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  search: z.string().trim().optional(),
});

export type GetUsersQueryDTO = z.infer<typeof GetUsersQuerySchema>;
