import { ChatMessage } from '../../../../domain/entities/chat-message.entity';

export interface IAiService {
  generateResponse(
    prompt: string,
    history: ChatMessage[],
    systemInstruction?: string
  ): Promise<string>;
}
