import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import {z} from 'zod'
import { GatewayModels } from "../../../infrastructure/ai/GatewayModels";
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService";
import { createSearchJobTool } from "../tools/SearchJobTool";
import { IApplyJobUseCase } from "../../interface/I-UseCases/Candidate/IApplyJobUseCase";  
import { createApplyJobTool } from "../tools/ApplyJobTools";
import { IGetCandidateALLAppications } from "../../interface/I-UseCases/Candidate/IGetCandidateALLAppications";  
import { IGetCandidateApplication } from "../../interface/I-UseCases/Candidate/IGetCandidateApplication";  
import { createGetUserApplicationsTool } from "../tools/GetUserApplicationsTool";
import { createGetApplicationDetailsTool } from "../tools/GetApplicationDetails";
import { IGetProfileCandidateUseCase } from "../../interface/I-UseCases/Candidate/IGetProfileCandidateUseCase";  
import { createGetProfileCandidateTool } from "../tools/GetCandidateProfileTool";
import { IGetResumeTextUseCase } from "../../interface/I-UseCases/Candidate/IGetResumeTextUseCase"; 
import { createAnalyzeResumeTool } from "../tools/AnalyseResumeTool";
import { IMentorAgent } from "../interfaces/IMentorAgent";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/TYPES";



@injectable()
export class MentorAgent implements IMentorAgent{
    private agentInstance

    constructor(
        @inject(TYPES.GatewayModel) aiGateway:GatewayModels,
        @inject(TYPES.IVectorSearchService) vectorSearchService:IVectorSearchService,
        @inject(TYPES.IApplyJobUseCase) applyJobUseCase:IApplyJobUseCase,
        @inject(TYPES.IGetAllApplicationsUseCase) getAllApplicationsUseCase:IGetCandidateALLAppications,
        @inject(TYPES.IGetCandidateApplicationUC) getApplicationDetailsUseCase:IGetCandidateApplication,
        @inject(TYPES.IGetProfileCanidateUseCase) getProfileCandidateUseCase:IGetProfileCandidateUseCase,
        @inject(TYPES.IGetResumeTextUseCase) getResumeTextUseCase:IGetResumeTextUseCase
    ){
        const searchJobTool = createSearchJobTool(vectorSearchService)
        const applyJobTool = createApplyJobTool(applyJobUseCase)
        const getUserApplicationsTool = createGetUserApplicationsTool(getAllApplicationsUseCase)
        const getApplicationDetailsTool = createGetApplicationDetailsTool(getApplicationDetailsUseCase)
        const getProfileCandidateTool = createGetProfileCandidateTool(getProfileCandidateUseCase)
        const analyzeResumeTool = createAnalyzeResumeTool(getResumeTextUseCase)

        const tools = [searchJobTool,applyJobTool,getUserApplicationsTool,
            getApplicationDetailsTool,getProfileCandidateTool,analyzeResumeTool
        ]
        
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