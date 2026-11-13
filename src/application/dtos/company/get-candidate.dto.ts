import { z } from 'zod';

export const GetCandidatesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform((val) => parseInt(val, 10)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform((val) => parseInt(val, 10)),
  search: z.string().optional(),
  location: z.string().optional(),
});

export type GetCandidatesQueryDTO = z.infer<typeof GetCandidatesQuerySchema>;

export const GetCandidatesCompanyIdSchema = z.object({
  companyId: z.string().min(1, 'CompanyId is required.'),
});

export type GetCandidatesCompanyIdDTO = z.infer<
  typeof GetCandidatesQuerySchema
>;
//combined dto query + companyid
export interface GetCandidatesCompanyRequestDTO
  extends GetCandidatesQueryDTO, GetCandidatesCompanyIdDTO {}

//get details

export const GetCandidateDetailParamsSchema = z.object({
  candidateId: z.string().min(1, 'Candidate Id is required'),
});

export type GetCandidateDetailParamsDTO = z.infer<
  typeof GetCandidateDetailParamsSchema
>;
