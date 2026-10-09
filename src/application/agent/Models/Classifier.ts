import { inject, injectable } from "inversify";
import { GatewayModels } from "../../../infrastructure/ai/GatewayModels";
import {z} from 'zod'
import { TYPES } from "../../../di/TYPES";

const intentSchema = z.object({
    intent:z.enum(['STATIC_PROFILE','SEARCH_JOB','CHAT_GENERAL','APPLY_JOB']),
    reasoning:z.string().describe('Breif explaination of why this intent was chosen')
})

export interface IClassfierIntent{
    classify(userMessage: string): Promise<"STATIC_PROFILE" | "SEARCH_JOB" | "CHAT_GENERAL" | "APPLY_JOB">
}

@injectable()
export class IntentClassifier{
    constructor(@inject(TYPES.GatewayModel) private aiGateWay:GatewayModels){}

    async classify(userMessage:string){
        const structeredOutputModel = this.aiGateWay.ClassifierModel.withStructuredOutput(intentSchema) 
        const prompt =`Analyse the user message below and categorize it: ${userMessage}`

        try {
            const result = await structeredOutputModel.invoke(prompt)
            return result.intent
        } catch (error) {
            return 'CHAT_GENERAL'
        }
    }
}