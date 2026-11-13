import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { IGetApplicationByJobIdUC } from '../../interface/use-cases/company/i-get-applications-by-jobId.use-case';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MongoClient } from 'mongodb';
import { ICompanyAnalystAgent } from '../interfaces/i-analyst-agent.interface';
import { BatchScreenWorkFlowTool } from '../tools/company/batch-screening.tool';

@injectable()
export class CompanyAnalystAgent implements ICompanyAnalystAgent {
  private agentInstance;
  private checkpointer: MongoDBSaver;

  constructor(
    @inject(TYPES.GatewayModel) aiGateway: GatewayModels,
    @inject(TYPES.MongoClient) private mongoClient: MongoClient,
    @inject(TYPES.IGetApplicationByJobIdUC)
    getApplicationByJobIdUC: IGetApplicationByJobIdUC,
    @inject(TYPES.BatchScreenWorkFlowTool) //should i TYPES add it first this workflow tool class
    private batchScreenWorkFlowTool: BatchScreenWorkFlowTool
  ) {
    // const getJobApplicationsTool = createGetJobApplicationsTool(getJobApplicationsUC);
    // const rankApplicantsTool = createRankApplicantsTool(rankApplicantsUC);
    // const analyzeCandidateResumeTool = createAnalyzeCandidateResumeTool(getResumeTextUC);
    const workflow = batchScreenWorkFlowTool.createWorkflow();
    const batchTool = batchScreenWorkFlowTool.createTool(workflow);

    const tools = [batchTool];
    this.checkpointer = new MongoDBSaver({
      client: mongoClient as any,
      dbName: 'ai_job_platform',
    });

    this.agentInstance = createReactAgent({
      llm: aiGateway.fallbackModel,
      tools: tools,
      checkpointSaver: this.checkpointer,
    });
  }

  async run(
    message: string,
    companyId?: string,
    threadId: string = 'default-session'
  ) {
    return await this.agentInstance.invoke(
      { messages: [{ role: 'user', content: message }] },
      {
        configurable: {
          thread_id: threadId,
          companyId: companyId,
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
