import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {z} from 'zod'
import { GatewayModels } from "../../infrastructure/gateways/GatewayModels.js";

const ApplyJobTool = tool(
    async({jobTitle,company,applicantName})=>{
        return JSON.stringify({
            status:'success',
            message:`Successfully submitted job application for "${jobTitle}" at "${company}" on behalf of ${applicantName}.`,
            confirmationId:`Job-${Math.random().toString(36).substring(2,9).toUpperCase()}`
        })
    },
    {
        name:"apply_job",
        description:'Use this tool when user explicitly wants to apply for a job',
        schema:z.object({
            jobTitle:z.string().describe('The title of the Job position being applied for'),
            company:z.string().describe('The title of the company offering the job'),
            applicantName:z.string().describe('The full name of the applicant'),
        })
    }
)


export interface IMentorAgent {
    run(message:string,threadId:string):Promise<any>
}

export class MentorAgent implements IMentorAgent{
    private agentInstance

    constructor(aiGateway:GatewayModels){
        const modelWithTools = aiGateway.getModelWithTool([ApplyJobTool])

        this.agentInstance = createReactAgent({
            llm:aiGateway.primaryModel,
            // llm:modelWithTools,
            tools:[ApplyJobTool],
            checkpointSaver:new MemorySaver()
        })
    }   

    async run (message:string,threadId:string ='default-session'){
        return await this.agentInstance.invoke(
            {messages:[{role:'user',content:message}]},
            {configurable:{thread_id:threadId}}
        )
    }
}