import { ChatMessage } from "../entities/ChatMessage.js";

export interface IAiService{
    generateResponse(prompt:string,history:ChatMessage[],systemInstruction?:string):Promise<string>
}