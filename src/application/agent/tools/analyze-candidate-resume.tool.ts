import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { IAnalyzeCandidateResumeUseCase } from '../interfaces/i-analyze-candidate-resume.use-case';
import { RunnableConfig } from '@langchain/core/runnables';

export const createAnalyzeCandidateTool = (
  analyzeCandidateResumeUseCase: IAnalyzeCandidateResumeUseCase
) => {
  return tool(
    async ({ jobId, candidateId }, config: RunnableConfig) => {
      try {
        const companyId = config.configurable?.companyId;

        if (!companyId || !candidateId || !jobId) {
          return JSON.stringify({
            status: 'error',
            message:
              'Missing required company Id, candidate Id or job Id for candidate analysis.',
          });
        }

        const analysisResult = await analyzeCandidateResumeUseCase.execute({
          companyId,
          candidateId,
          jobId,
        });

        return JSON.stringify({
          status: 'success',
          analysis: analysisResult,
        });
      } catch (error) {
        return JSON.stringify({
          status: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'Error in analyze candidate resume',
        });
      }
    },
    {
      name: 'analyze_candidate_resume',
      description:
        'Perform deep AI analysis and screen of an individual candidate resume and profile against a specific job posting, returning a verdict, match score, strengths, gaps, and suggested interview questions.',
      schema: z.object({
        jobId: z
          .string()
          .describe(
            'The job id required to get the context on which job is the candidate data being valuated on.'
          ),
        candidateId: z
          .string()
          .describe(
            'The unique user ID of the candidate whose resume and profile you want to screen.'
          ),
      }),
    }
  );
};
