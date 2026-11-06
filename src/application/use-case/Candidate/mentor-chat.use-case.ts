import { inject, injectable } from 'inversify';
import { IUserRepository } from '../../../domain/repositories/i-user.repository';
// import { GatewayModels } from '../../../infrastructure/ai/gateway.models';
import { IClassfierIntent } from '../../agent/models/classifier.model';
import { MentorAgent } from '../../agent/models/mentor-agent.model';
import { TYPES } from '../../../di/types';
import { MentorChatRequestDTO } from '../../dtos/candidate/mentor-chat.dto';
import { OutputGuardrail } from '../../agent/security/output.guardrail.util';
import { logger } from '../../../shared/utils/loggers.util';
import { IChatSessionRepository } from '../../../domain/repositories/i-chat-session-repository';
type intentType = 'STATIC_PROFILE' | 'SEARCH_JOB' | 'GENERAL_CHAT';

@injectable()
export class MentorChatUseCase {
  constructor(
    @inject(TYPES.IntentClassifier) private classifier: IClassfierIntent,
    @inject(TYPES.IMentorAgent) private mentorAgent: MentorAgent,
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IChatSessionRepository)
    private chatSessionRepo: IChatSessionRepository
    // private vectorSearch: VectorSearchService,
  ) {}

  // async execute({userId,message}:{userId:string,message:string}){
  async execute(dto: MentorChatRequestDTO) {
    const { userId, message } = dto;
    const threadId = dto.threadId || crypto.randomUUID();
    const intent = (await this.classifier.classify(message)) as intentType;

    const chatSession = await this.chatSessionRepo.findById(threadId);
    if (!chatSession) {
      const generatedTitle = 'new chat';
      await this.chatSessionRepo.create({
        id: threadId,
        userId,
        title: generatedTitle,
      });
    }

    // if(intent === 'STATIC_PROFILE'){
    //     const user = await this.userRepo.findById(userId)
    //     return{
    //         userReq:message,
    //         intent,
    //         response:`Here is your profile data:\n
    //             ${user?.toJSON()}
    //         `
    //     }
    // }
    // else if(intent === 'SEARCH_JOB'){
    //     const agentResult =  await this.mentorAgent.run(message,userId)
    //     const lastMessage = agentResult.messages[agentResult.messages.length-1]

    //     console.log('----> SEARCH_JOB_AgentSuccess')
    //     return{
    //         userReq:message,
    //         intent,
    //         response:lastMessage?.content || "I couldn't process that request"
    //     }
    // }
    //default general chat

    const agentResult = await this.mentorAgent.run(message, userId, threadId);
    const lastMessage = agentResult.messages[agentResult.messages.length - 1];
    const rawResponse =
      lastMessage?.content || "I couldn't process that request";

    let finalResponse =
      typeof rawResponse === 'string'
        ? rawResponse
        : JSON.stringify(rawResponse);

    if (OutputGuardrail.containsSystemPromptLeak(finalResponse)) {
      logger.warn(
        {
          event: 'security_guardrail_triggered',
          guardrialType: 'OUTPUT_SYSTEM_PROMPT_LEAK',
          userId,
          userMessage: message,
        },
        'Output gaurdrail triggered: Potential system prompt disclosure blocked.'
      );

      finalResponse =
        "I'm sorry, but I cannot fulfill that request or diclose my internal instructions.";
    } else {
      // finalResponse = OutputGuardrail.sanitize(finalResponse)
    }

    return {
      userReq: message,
      intent,
      threadId,
      response: finalResponse,
    };
  }
}
