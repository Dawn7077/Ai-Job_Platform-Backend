import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../di/types';
import { MongoClient } from 'mongodb';
import { IRankApplicantsUseCase } from '../../../interface/use-cases/company/i-rank-applicants.use-case';
import { IAnalyzeCandidateResumeUseCase } from '../../interfaces/i-analyze-candidate-resume.use-case';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { RunnableConfig } from '@langchain/core/runnables';

const BatchScreenState = Annotation.Root({
  companyId: Annotation<string>(),
  jobId: Annotation<string>(),
  limit: Annotation<number>(),
  candidateIds: Annotation<string[]>({
    reducer: (x, y) => y ?? x, //adds to the array of feedbacks
    default: () => [],
  }),
  currentIndex: Annotation<number>({
    reducer: (x, y) => y ?? x,
    default: () => 0,
  }),
  analysisResults: Annotation<any[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  statusMessage: Annotation<string>(),
});

@injectable()
export class BatchScreenWorkFlowTool {
  private checkpointer: MongoDBSaver;
  constructor(
    @inject(TYPES.MongoClient) private mongoClient: MongoClient,
    @inject(TYPES.IRankApplicantsUseCase)
    private rankApplicantsUseCase: IRankApplicantsUseCase,
    @inject(TYPES.IAnalyzeCandidateResumeUseCase)
    private analyzeCandidateResumeUC: IAnalyzeCandidateResumeUseCase
  ) {
    this.checkpointer = new MongoDBSaver({
      client: mongoClient as any,
      dbName: 'ai_job_platform',
    });
  }

  public createWorkflow() {
    const worflow = new StateGraph(BatchScreenState)
      .addNode('fetch_and_rank', async (state) => {
        console.log('Batch Workflow: Fetching and ranking applicants...');
        const ranked = await this.rankApplicantsUseCase.execute({
          jobId: state.jobId,
          companyId: state.companyId,
          limit: state.limit || 10,
        });
        const ids = ranked.applicants.map((app) => app.candidateId);
        return {
          candidateIds: ids,
          currentIndex: 0,
          analysisResults: [],
          statusMessage: `Found ${ids.length} candidates to screen. Beginning analysis loop...`,
        };
      })
      .addNode('analyze_next', async (state) => {
        const idx = state.currentIndex;
        const candidateId = state.candidateIds[idx];
        if (!candidateId) {
          throw new Error(
            `No candidate Id provided for analyze candidate resume usecase node. `
          );
        }
        console.log(
          `Batch Workflow: Analyzing candidate [${idx + 1}/${state.candidateIds.length}]: ${candidateId}`
        );

        try {
          const analysis = await this.analyzeCandidateResumeUC.execute({
            companyId: state.companyId,
            jobId: state.jobId,
            candidateId,
          });

          return {
            currentIndex: idx + 1,
            analysisResults: [analysis],
            statusMessage: `Successfully analyzed candidate ${idx + 1} of ${state.candidateIds.length}`,
          };
        } catch (err) {
          console.error(`Error on analysing candidate ${candidateId}:`, err);
          return {
            currentIndex: idx + 1,
            analysisResults: [
              { candidateId, error: 'Analysis error for this candidate' },
            ],
            statusMessage: `Error analyzing candidate ${idx + 1}`,
          };
        }
      })
      .addEdge(START, 'fetch_and_rank')
      .addEdge('fetch_and_rank', 'analyze_next')
      .addConditionalEdges('analyze_next', (state) => {
        if (state.currentIndex < state.candidateIds.length) {
          return 'analyze_next';
        }
        return END;
      });

    return worflow.compile({
      checkpointer: this.checkpointer,
    });
  }

  public createTool(compiledGraph: any) {
    return tool(
      async ({ jobId, limit }, config: RunnableConfig) => {
        try {
          const companyId = config.configurable?.companyId;
          const threadId =
            config.configurable?.thread_id || crypto.randomUUID();

          if (!companyId || !jobId) {
            return JSON.stringify({
              status: 'error',
              message:
                'Company and job ID are required to run batch screening.',
            });
          }

          const finalState = await compiledGraph.invoke(
            {
              companyId,
              jobId,
              limit: limit || 5,
            },
            { configurable: { thread_id: threadId } }
          );

          return JSON.stringify({
            status: 'success',
            totalScreened: finalState.analysisResults?.length || 0,
            results: finalState.analysisResults || [],
          });
        } catch (error) {
          return JSON.stringify({
            status: 'error',
            message:
              error instanceof Error
                ? error.message
                : 'Error in batch screening applicants',
          });
        }
      },
      {
        name: 'batch_screen_applicants',
        description:
          'Ranks and performs deep AI candidates profile and resume screening for top applicants of a job opening in  an automated batch sequence.  ',
        schema: z.object({
          jobId: z.string().describe('The job posting ID'),
          limit: z
            .number()
            .optional()
            .describe('Maximum number of top candidates to screen (default 5)'),
        }),
      }
    );
  }
}
//used by company analyst
