import { z } from 'zod';
import { ApplicationStage } from '../../../domain/entities/application.entity';

export const UpdateApplicationParamSchema = z.object({
  id: z.string().min(1, 'Application Id is required'),
});
export const UpdateApplicationStageRequestSchema = z.object({
  stage: z.nativeEnum(ApplicationStage, {
    message: 'Invalid application stage provided',
  }),
});

export type UpdateApplicationParamDTO = z.infer<
  typeof UpdateApplicationParamSchema
>;
export type UpdateApplicationStageRequestDTO = z.infer<
  typeof UpdateApplicationStageRequestSchema
>;
