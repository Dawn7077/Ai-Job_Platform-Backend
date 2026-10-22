import { z } from 'zod';
import { User } from '../../../domain/entities/user.entity';
import { UserRole } from '@prisma/client';

export const GoogleLoginSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
  role: z.nativeEnum(UserRole),
});

export type GoogleLoginRequestDTO = z.infer<typeof GoogleLoginSchema>;
export type GoogleLoginResponseDTO =
  | { user: User; requiresApproval: true; message: string }
  | {
      accessToken: string;
      refreshToken: string;
      user: User;
      isOnboarding: boolean;
    };
