import { tool } from "@langchain/core/tools";
import {z} from 'zod'
import { RunnableConfig } from "@langchain/core/runnables";
import { IApplyJobUseCase } from "../../use-case/Candidate/ApplyJobUseCase.js";

export const createApplyJobTool = (applyJobUseCase:IApplyJobUseCase)=>{
    return tool(
        async({jobId,resumeUrl},config:RunnableConfig)=>{
            try {
                const candidateId = config.configurable?.candidateId
                console.log('applytool log =>',`\n
                    ${(jobId&&candidateId)?'Both Id received✅':"missing candidate or job ID❌"}
                    `)
                
                if(!candidateId){
                    console.log('candidateId Missing in applytool')
                    return JSON.stringify({
                        status:"error",
                        message:"Authentication error:Candidate ID is missing from the context."
                    })
                }
                
                const application  = await applyJobUseCase.execute(
                    candidateId,jobId,resumeUrl
                )
                
                const appData = application.toJSON()
                console.log('applytool executed =>',appData)


                return JSON.stringify({
                    status:"success",
                    message:"Successfully applied to job position.",
                    applicationId:appData.id ,
                    appliedAt:appData.createdAt,
                })
            } catch (error) {
                return JSON.stringify({
                    status:"ERROR",
                    message: error instanceof Error
                            ? error.message
                            : "Error on submitting application using ai agent.",
                    code: "APPLICATION_AGENT_ERROR"
                })
            }
        },
        {
            name:'apply_job',
            description:"Applies the authencated candidate to a specific job position using the unique jobId. Always search for the exact jobId first using the job search tool before executing this action. ",
            schema:z.object({
                jobId:z.string().describe("The unique ID (UUID/Database ID) of the target job position"),
                resumeUrl:z.string().optional().describe("Optional URL pointing to the candidate's custome resume PDF for this job." )
            })
        
        }
    )
}