import {ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import { ChatGroq } from '@langchain/groq'

export class GatewayModels{ 
    public primaryModel:ChatGoogleGenerativeAI
    public fallbackModel:ChatGroq
    public ClassifierModel:ChatGoogleGenerativeAI
    public EmbeddingsModel:GoogleGenerativeAIEmbeddings
    constructor(){
        this.primaryModel = new ChatGoogleGenerativeAI({
            apiKey:process.env.GOOGLE_LLM_API_KEY ?? '',
            model:'gemini-2.5-flash'
        })
        
        this.fallbackModel = new ChatGroq({
            apiKey:process.env.GROQ_LLM_API_KEY ??'',
            model:'llama-3.3-70b-versatile'
        })
        

        this.ClassifierModel = new ChatGoogleGenerativeAI({
            apiKey:process.env.GOOGLE_CLASSIFICATION_API_KEY??'',
            model:'gemini-2.5-flash'
        })
        this.EmbeddingsModel = new GoogleGenerativeAIEmbeddings({
            apiKey:process.env.GOOGLE_LLM_API_KEY??'',
            model:'gemini-embedding-001',
        })
    }

    public getModelWithTool(tools:any[]){
        const primaryWithTools = this.primaryModel.bindTools(tools)
        const fallbackWithTools = this.fallbackModel.bindTools(tools)

        return primaryWithTools.withFallbacks({
            fallbacks:[fallbackWithTools]
        })
    }
     
}

 