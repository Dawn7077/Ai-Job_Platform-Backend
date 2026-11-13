import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { ICompanyAnalystAgent } from '../../agent/interfaces/i-analyst-agent.interface';
import { IChatSessionRepository } from '../../../domain/repositories/i-chat-session-repository';
import { AnalystChatRequestDTO } from '../../dtos/company/company-analyst-chat.dto';
import { OutputGuardrail } from '../../agent/security/output.guardrail.util';
import { ICompanyAnalystChatUseCase } from '../../interface/use-cases/company/i-company-analyst-chat.use-case';

@injectable()
export class CompanyAnalystChatUseCase implements ICompanyAnalystChatUseCase {
  constructor(
    @inject(TYPES.ICompanyAnalystAgent)
    private analystAgent: ICompanyAnalystAgent,
    @inject(TYPES.IChatSessionRepository)
    private chatSessionRepo: IChatSessionRepository
  ) {}

  async execute(dto: AnalystChatRequestDTO) {
    const { userId, message } = dto;
    const threadId = dto.threadId || crypto.randomUUID();
    const chatSession = await this.chatSessionRepo.findById(threadId);
    if (!chatSession) {
      await this.chatSessionRepo.create({
        id: threadId,
        userId: userId,
        title: 'Recuiter Analyst Session',
      });
    }

    const agentResult = await this.analystAgent.run(message, userId, threadId);
    const lastMessage = agentResult.messages[agentResult.messages.length - 1];
    const rawResponse =
      lastMessage?.content || "I couldn't process that request.";
    let finalResponse =
      typeof rawResponse === 'string'
        ? rawResponse
        : JSON.stringify(rawResponse);

    if (OutputGuardrail.containsSystemPromptLeak(finalResponse)) {
      finalResponse =
        "I'm sorry, but I cannot fulfill that request or disclose my internal instructions.";
    }

    return {
      userReq: message,
      threadId,
      response: finalResponse,
    };
  }
}
