import { tool } from "@langchain/core/tools";
import {z} from "zod"
import { RunnableConfig } from "@langchain/core/runnables";
import { IGetCandidateALLAppications } from "../../interface/I-UseCases/Candidate/IGetCandidateALLAppications";  

export const createGetUserApplicationsTool = (
    getApplicationsUseCase:IGetCandidateALLAppications
)=>{
    return tool(
        async(_,config:RunnableConfig)=>{
            try {
                const candidateId = config.configurable?.candidateId
                if(!candidateId){
                    return JSON.stringify({
                        status:"error",
                        message:'Unauthorized: Candidate ID is missing.'
                    })
                }

                const applications  = await getApplicationsUseCase.execute(candidateId)
                const data = applications.map(app=>app.toJSON())

                return JSON.stringify({
                    status:"success",
                    count:data.length,
                    applications:data
                })

            } catch (error) {
                return JSON.stringify({
                    status:"error",
                    message:error instanceof Error?error.message : 'Error in fetching applications'
                })
            }
        },
        {
            name:"get_user_applications",
            description:"Retrive a list of all applications submitted by the logged-in candidate. Use this when the candidate asks 'What jobs have I applied to?', 'show my applications', or 'Check my application status'",
            schema:z.object({})
        }
    )
}