import { inject, injectable } from 'inversify';
import { IApplyJobUseCase } from '../../interface/use-cases/candidate/i-apply-job.use-case';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { TYPES } from '../../../di/types';
import { StateGraph, Annotation, START, END } from '@langchain/langgraph';
import { ApplyJobSchema } from '../../dtos/candidate/apply-job.dto';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { MongoClient } from 'mongodb';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { RunnableConfig } from '@langchain/core/runnables';
import { ICandidateProfileRepository } from '../../../domain/repositories/i-candidate-profile.repository';

const ApplyWorkflowState = Annotation.Root({
  candidateId: Annotation<string>(),
  jobId: Annotation<string>(),
  resumeKey: Annotation<string | undefined>(),
  coverLetter: Annotation<string | undefined>(),
  isApproved: Annotation<boolean>(),
  applicationId: Annotation<string | undefined>(),
  statusMessage: Annotation<string | undefined>(),
});

@injectable()
export class ApplyWorkFlowBuilder {
  private checkpointer: MongoDBSaver;
  constructor(
    @inject(TYPES.IApplyJobUseCase) private applyJobUseCase: IApplyJobUseCase,
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository,
    @inject(TYPES.ICandidateProfileRepo)
    private candidateProfileRepo: ICandidateProfileRepository,
    @inject(TYPES.MongoClient) private mongoClient: MongoClient
  ) {
    this.checkpointer = new MongoDBSaver({
      client: mongoClient as any,
      dbName: 'ai_job_platform',
    });
  }

  public createWorkflow() {
    const workflow = new StateGraph(ApplyWorkflowState)
      .addNode('generate_documents', async (state) => {
        console.log(
          'Workflow Node: Fetching profile & drafting cover letter...'
        );
        const candidateProfile = await this.candidateProfileRepo.findByUserId(
          state.candidateId
        );

        if (!candidateProfile) {
          throw new Error(
            'No profile found in user id. Please create a profile first.'
          );
        }
        if (!candidateProfile || !candidateProfile.resumeKey) {
          throw new Error(
            'No resume found in your profile. Please upload a resume first.'
          );
        }

        const draftCoverLetter = `Dear Hiring Manager,\n\nI am thrilled to apply for this position. With my background in ${candidateProfile.skills?.slice(0, 3).join(', ')}, I am confident...`;

        return {
          resumeKey: candidateProfile.resumeKey,
          coverLetter: draftCoverLetter,
          statusMessage:
            'Documents generated and uploaded to Cloudflare R2 successfully.',
        };
      })
      .addNode('human_approval', async (state) => {
        return {
          statusMessage: 'Awaiting candidate approval',
        };
      })
      .addNode('submit_application', async (state) => {
        console.log('Workflow Node: Submitting application to database...');
        const candidateId = state.candidateId;
        const jobId = state.jobId;
        const dto = ApplyJobSchema.parse({
          candidateId,
          jobId,
          resumeKey: state.resumeKey,
          coverLetter: state.coverLetter,
        });

        const existingApplication =
          await this.applicationRepo.findByCandidateAndJob(candidateId, jobId);

        if (existingApplication) {
          return {
            statusMessage: `You have already applied to this job position. Please check your application history. The Application Id is ${existingApplication.id}`,
            applicationId: existingApplication.id,
          };
        }

        const application = await this.applyJobUseCase.execute(dto);
        const appData = application.toJSON();
        console.log('applytool executed =>', appData);
        return {
          applicationId: appData.id,
          statusMessage: 'Successfully applied to job position.',
        };
      })
      .addEdge(START, 'generate_documents')
      .addEdge('generate_documents', 'human_approval')
      .addEdge('human_approval', 'submit_application')
      .addEdge('submit_application', END);

    // Compile graph with checkpointing so it can pause and resume
    return workflow.compile({
      checkpointer: this.checkpointer,
      interruptBefore: ['human_approval'],
    });
  }

  public createTool(compliedGraph: any) {
    return tool(
      async ({ jobId }, config: RunnableConfig) => {
        const candidateId = config.configurable?.candidateId;
        const threadId = config.configurable?.thread_id;

        if (!candidateId) {
          return JSON.stringify({
            status: 'error',
            message:
              'Authentication error: Candidate ID is missing from the context.',
          });
        }
        const result = compliedGraph.invoke(
          { candidateId, jobId },
          { configurable: { thread_id: threadId } }
        );

        const currentState = await compliedGraph.getState({
          configurable: { thread_id: threadId },
        });

        if (currentState.next.includes('human_approval')) {
          return JSON.stringify({
            status: 'pending',
            message:
              'I have generated the cover letter and resume for your application. Please review them and provide your approval to proceed .',
            coverLetter: result.coverLetter,
            resumeUrl: result.resumeKey,
            coverletterUrl: result.coverLetterKey,
            threadId, // Return threadId so frontend/mentor agent can resume the exact session
          });
        }

        return JSON.stringify({
          status: 'success',
          message: result.statusMessage,
          applicationId: result.applicationId,
        });
      },
      {
        name: 'advanced_apply_job',
        description:
          'Generates a tailored cover letter using profile data, pauses for user approval, and submits the job application.',
        schema: z.object({
          jobId: z
            .string()
            .describe('The unique ID of the target job position'),
        }),
      }
    );
  }
}
