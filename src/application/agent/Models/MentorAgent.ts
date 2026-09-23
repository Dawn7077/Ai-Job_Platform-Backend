import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {z} from 'zod'
import { GatewayModels } from "../../../infrastructure/gateways/GatewayModels.js";
import { IVectorSearchService } from "../../../infrastructure/Interface/IVectorSearchService.js";
import { createSearchJobTool } from "../tools/SearchJobTool.js";
import { IApplyJobUseCase } from "../../use-case/Candidate/ApplyJobUseCase.js";
import { createApplyJobTool } from "../tools/ApplyJobTools.js";
import { IGetCandidateALLAppications } from "../../use-case/Candidate/GetAllApplications.js";
import { IGetCandidateApplication } from "../../use-case/Candidate/GetCandidateApplication.js";
import { createGetUserApplicationsTool } from "../tools/GetUserApplicationsTool.js";
import { createGetApplicationDetailsTool } from "../tools/GetApplicationDetails.js";
import { IGetProfileCandidateUseCase } from "../../use-case/Candidate/GetProfileCandidate.js";
import { createGetProfileCandidateTool } from "../tools/GetCandidateProfileTool.js";

// const ApplyJobTool = tool(//mock apply
//     async({jobTitle,company,applicantName})=>{
//         return JSON.stringify({
//             status:'success',
//             message:`Successfully submitted job application for "${jobTitle}" at "${company}" on behalf of ${applicantName}.`,
//             confirmationId:`Job-${Math.random().toString(36).substring(2,9).toUpperCase()}`
//         })
//     },
//     {
//         name:"apply_job",
//         description:'Use this tool when user explicitly wants to apply for a job',
//         schema:z.object({
//             jobTitle:z.string().describe('The title of the Job position being applied for'),
//             company:z.string().describe('The title of the company offering the job'),
//             applicantName:z.string().describe('The full name of the applicant'),
//         })
//     }
// )


export interface IMentorAgent {
    run(message:string,candidateId:string,threadId:string):Promise<any>
}

export class MentorAgent implements IMentorAgent{
    private agentInstance

    constructor(
        aiGateway:GatewayModels,
        vectorSearchService:IVectorSearchService,
        applyJobUseCase:IApplyJobUseCase,
        getAllApplicationsUseCase:IGetCandidateALLAppications,
        getApplicationDetailsUseCase:IGetCandidateApplication,
        getProfileCandidateProfileUseCase:IGetProfileCandidateUseCase,
    ){
        const searchJobTool = createSearchJobTool(vectorSearchService)
        const applyJobTool = createApplyJobTool(applyJobUseCase)
        const getUserApplicationsTool = createGetUserApplicationsTool(getAllApplicationsUseCase)
        const getApplicationDetailsTool = createGetApplicationDetailsTool(getApplicationDetailsUseCase)
        const getProfileCandidateTool = createGetProfileCandidateTool(getProfileCandidateProfileUseCase)

        const tools = [searchJobTool,applyJobTool,getUserApplicationsTool,getApplicationDetailsTool,getProfileCandidateTool]
        
        const modelWithTools = aiGateway.getModelWithTool(tools)  

        console.log(
            "REGISTERED TOOLS:",
            tools.map(tool => tool.name)
        )

        this.agentInstance = createReactAgent({
            llm:aiGateway.fallbackModel.bindTools(tools),
            // llm:modelWithTools,
            tools:tools,
            checkpointSaver:new MemorySaver()
        })
    }   

    async run (message:string,candidateId?:string,threadId:string ='default-session'){
        return await this.agentInstance.invoke(
            {messages:[{role:'user',content:message}]},
            {configurable:{
                thread_id:threadId,
                candidateId:candidateId,
            }}
        )
    }
}