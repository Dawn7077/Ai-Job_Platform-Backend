import { tool } from "@langchain/core/tools";
import {z} from 'zod'
import { RunnableConfig } from "@langchain/core/runnables"; 
import { IGetCandidateApplication } from "../../interface/I-UseCases/Candidate/IGetCandidateApplication";

export const createGetApplicationDetailsTool = (
    getApplicationDetailsUseCase:IGetCandidateApplication)=>{
    return tool(
        async({applicationId},config:RunnableConfig)=>{
            try {
                const candidateId = config.configurable?.candidateId
                if(!candidateId){
                    return JSON.stringify({
                        status:"error",
                        message:'Unauthorized: Candidate ID is missing.'
                    })
                }

                const data = await getApplicationDetailsUseCase.execute(candidateId,applicationId)

                return JSON.stringify({
                    status:"success",
                    application:data.application,
                    job:data.job
                })
            } catch (error) {
                return JSON.stringify({
                    status:"error",
                    message:error instanceof Error?error.message : 'Error in fetching applications'
                })
            }
        },
        {
            name:"get_application_details",
            description:"Retrive the details information about a single job application using its unique applicationId. Use this when the user ask for details about a specific applicaion ID.",
            schema:z.object({
                applicationId:z.string().describe('The unique Identifier of the specific application')
            })


        }
    )
}