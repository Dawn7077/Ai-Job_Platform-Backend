import { ChatMessage } from "../../../../domain/entities/ChatMessage";

export interface IAiService{
    generateResponse(prompt:string,history:ChatMessage[],systemInstruction?:string):Promise<string>
}