import { tool } from '@langchain/core/tools';
import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { IVectorSearchService } from '../../interface/services/i-vector-search.service';
import { createSearchJobTool } from '../tools/search-job.tool';
import { IApplyJobUseCase } from '../../interface/use-cases/candidate/i-apply-job.use-case';
import { createApplyJobTool } from '../tools/apply-job.tool';
import { IGetCandidateALLAppications } from '../../interface/use-cases/candidate/i-get-candidate-all-applications.use-case';
import { IGetCandidateApplication } from '../../interface/use-cases/candidate/i-get-candidate-application.use-case';
import { createGetUserApplicationsTool } from '../tools/get-user-applications.tool';
import { createGetApplicationDetailsTool } from '../tools/get-application-details.tool';
import { IGetProfileCandidateUseCase } from '../../interface/use-cases/candidate/i-get-profile-candidate.use-case';
import { createGetProfileCandidateTool } from '../tools/get-candidate-profile.tool';
import { IGetResumeTextUseCase } from '../../interface/use-cases/candidate/i-get-resume-text.use-case';
import { createAnalyzeResumeTool } from '../tools/analyse-resume.tool';
import { IMentorAgent } from '../interfaces/i-mentor-agent.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';

@injectable()
export class MentorAgent implements IMentorAgent {
  private agentInstance;

  constructor(
    @inject(TYPES.GatewayModel) aiGateway: GatewayModels,
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
    getResumeTextUseCase: IGetResumeTextUseCase
  ) {
    const searchJobTool = createSearchJobTool(vectorSearchService);
    const applyJobTool = createApplyJobTool(applyJobUseCase);
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

    const modelWithTools = aiGateway.getModelWithTool(tools);

    console.log(
      'REGISTERED TOOLS:',
      tools.map((tool) => tool.name)
    );

    this.agentInstance = createReactAgent({
      llm: aiGateway.fallbackModel.bindTools(tools),
      // llm:modelWithTools,
      tools: tools,
      checkpointSaver: new MemorySaver(),
    });
  }

  async run(
    message: string,
    candidateId?: string,
    threadId: string = 'default-session'
  ) {
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
}
