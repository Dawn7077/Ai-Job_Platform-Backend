import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { IRankApplicantsUseCase } from '../../../interface/use-cases/company/i-rank-applicants.use-case';
import { RunnableConfig } from '@langchain/core/runnables';

export const createRankApplicantsTool = (
  rankApplicantsUC: IRankApplicantsUseCase
) => {
  return tool(
    async ({ jobId, limit }, config: RunnableConfig) => {
      try {
        const companyId = config.configurable?.companyId;
        if (!jobId || !companyId) {
          return JSON.stringify({
            status: 'error',
            message: 'Job Id and company user Id required to rank applicants.',
          });
        }
        const ranked = await rankApplicantsUC.execute({
          jobId,
          companyId,
          limit,
        });

        return JSON.stringify({
          status: 'success',
          count: ranked.applicants.length,
          rankedData: ranked,
        });
      } catch (error) {
        return JSON.stringify({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Error in ranking applicants',
        });
      }
    },
    {
      name: 'rank_applicants',
      description:
        'Rank applicants for a job position using internal profile matching metrics and skills overlap',
      schema: z.object({
        jobId: z
          .string()
          .optional()
          .describe('The job ID to rank candidates for.'),
        limit: z
          .number()
          .optional()
          .describe('Number of top candidates to return (default 10)'),
      }),
    }
  );
};
//for company analyst
