// import { tool } from '@langchain/core/tools';
import { MemorySaver } from '@langchain/langgraph';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
// import { z } from 'zod';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { IVectorSearchService } from '../../interface/services/i-vector-search.service';
import { IApplyJobUseCase } from '../../interface/use-cases/candidate/i-apply-job.use-case';
import { IGetCandidateALLAppications } from '../../interface/use-cases/candidate/i-get-candidate-all-applications.use-case';
import { IGetCandidateApplication } from '../../interface/use-cases/candidate/i-get-candidate-application.use-case';
import { createGetUserApplicationsTool } from '../tools/get-user-applications.tool';
import { createGetApplicationDetailsTool } from '../tools/get-application-details.tool';
import { IGetProfileCandidateUseCase } from '../../interface/use-cases/candidate/i-get-profile-candidate.use-case';
import { createGetProfileCandidateTool } from '../tools/get-candidate-profile.tool';
import { IGetResumeTextUseCase } from '../interfaces/i-get-resume-text.use-case';
import { createAnalyzeResumeTool } from '../tools/analyse-resume.tool';
import { IMentorAgent } from '../interfaces/i-mentor-agent.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { MongoClient } from 'mongodb';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { createSearchJobTool } from '../tools/candidate/search-job.tool';
import { createApplyJobTool } from '../tools/candidate/apply-job.tool';

@injectable()
export class MentorAgent implements IMentorAgent {
  private agentInstance;
  private checkpointer: MongoDBSaver;

  constructor(
    @inject(TYPES.GatewayModel) aiGateway: GatewayModels,
    @inject(TYPES.MongoClient) private mongoClient: MongoClient,
    @inject(TYPES.IVectorSearchService)
    vectorSearchService: IVectorSearchService,
    @inject(TYPES.IApplyJobUseCase) applyJobUseCase: IApplyJobUseCase,
    @inject(TYPES.IGetAllApplicationsUseCase)
    getAllApplicationsUseCase: IGetCandidateALLAppications,
    @inject(TYPES.IGetCandidateApplicationUC)
    getApplicationDetailsUseCase: IGetCandidateApplication,
    @inject(TYPES.IGetProfileCanidateUseCase)
    getProfileCandidateUseCase: IGetProfileCandidateUseCase,
    @inject(TYPES.IGetResumeTextUseCase)
    getResumeTextUseCase: IGetResumeTextUseCase,
    @inject(TYPES.IApplicationRepo) applicationRepo: IApplicationRepository
  ) {
    const searchJobTool = createSearchJobTool(vectorSearchService);
    const applyJobTool = createApplyJobTool(applyJobUseCase, applicationRepo);
    const getUserApplicationsTool = createGetUserApplicationsTool(
      getAllApplicationsUseCase
    );
    const getApplicationDetailsTool = createGetApplicationDetailsTool(
      getApplicationDetailsUseCase
    );
    const getProfileCandidateTool = createGetProfileCandidateTool(
      getProfileCandidateUseCase
    );
    const analyzeResumeTool = createAnalyzeResumeTool(getResumeTextUseCase);

    const tools = [
      searchJobTool,
      applyJobTool,
      getUserApplicationsTool,
      getApplicationDetailsTool,
      getProfileCandidateTool,
      analyzeResumeTool,
    ];

    const _modelWithTools = aiGateway.getModelWithTool(tools);

    console.log(
      'REGISTERED TOOLS:',
      tools.map((tool) => tool.name)
    );

    this.checkpointer = new MongoDBSaver({
      client: mongoClient as any,
      dbName: 'ai_job_platform',
    });

    //     const STATIC_SYSTEM_PROMPT = `You are an AI Career Mentor for a job platform...
    // // Include detailed instructions, formatting rules, and tool usage guidelines here.
    // // Keep this 100% identical for all users so Gemini/Groq caches it automatically.`;

    this.agentInstance = createReactAgent({
      llm: aiGateway.fallbackModel.bindTools(tools),
      // llm:modelWithTools,
      tools: tools,
      checkpointSaver: this.checkpointer,
      // stateModifier: STATIC_SYSTEM_PROMPT,
    });
  }

  async run(
    message: string,
    candidateId?: string,
    threadId: string = 'default-session'
  ) {
    console.log('mentor model candidateId:', candidateId);
    return await this.agentInstance.invoke(
      { messages: [{ role: 'user', content: message }] },
      {
        configurable: {
          thread_id: threadId,
          candidateId: candidateId,
        },
      }
    );
  }

  async getThreadMessages(threadId: string) {
    try {
      const tuple = await this.checkpointer.getTuple({
        configurable: { thread_id: threadId },
      });

      if (!tuple || !tuple.checkpoint) {
        return [];
      }

      const channelValues = tuple.checkpoint.channel_values as any;
      return channelValues?.messages || [];
    } catch (error) {
      console.log(`Error fetching messages for thread ${threadId}:`, error);
      return [];
    }
  }
}
