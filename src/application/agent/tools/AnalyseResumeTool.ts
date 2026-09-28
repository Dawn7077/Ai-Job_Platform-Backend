import { tool } from "@langchain/core/tools";
import {z} from 'zod'
import { IGetResumeTextUseCase } from "../use-case/GetResumeTextUseCase.js";
import { RunnableConfig } from "@langchain/core/runnables";
export const createAnalyzeResumeTool = (
    getResumeTextUseCase:IGetResumeTextUseCase
)=>{
    return tool(
        async(_,config:RunnableConfig)=>{
            const candidateId = config.configurable?.candidateId
            if(!candidateId){
                return JSON.stringify({
                    error:"Unauthorized:Missing Candidate ID"
                })
            }
            console.log('analyse tool being used ==>')
            
            try {
                const rawResumeText = await getResumeTextUseCase.execute(candidateId)
                console.log('got resume raw text==>')
                return JSON.stringify({
                    status:"success",
                    resumeContent:rawResumeText,
                    instruction: "Analyse this raw resume text throughly. Provide concrete suggestions, line-item rewrites, and formatting tips based on the candidate's target goals"
                })

            } catch (error) {
                return JSON.stringify({
                    status:"error",
                    message:error instanceof Error ? error.message : "Error on retriving candidate resume text."
                })
            }
        },
        {
            name:'analyze_candidate_resume',
            description:"Extract the candidate's raw resume text from the storage to perform deep ATS optimization, bullet point rewrites, and detailed feedback conversations.",
            schema:z.object({})

        }
    )
}