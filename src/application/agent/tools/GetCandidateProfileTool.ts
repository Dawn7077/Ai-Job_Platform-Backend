import { tool } from "@langchain/core/tools";
import {z} from 'zod' 
import { RunnableConfig } from "@langchain/core/runnables";
import { IGetProfileCandidateUseCase } from "../../interface/I-UseCases/Candidate/IGetProfileCandidateUseCase";

export const createGetProfileCandidateTool = (getProfileUseCase:IGetProfileCandidateUseCase)=>{
    return tool(
        async(_,config:RunnableConfig)=>{
            const candidateId = config.configurable?.candidateId
            if(!candidateId){
                return JSON.stringify({
                    status:"error",
                    message:"Candidate ID is missing from the execution context."
                })
            }

            try {
                const profile = await getProfileUseCase.execute(candidateId)
                
                return JSON.stringify({
                    status:"success",
                    profile:{
                        id:profile.id,
                        firstName:profile.firstName,
                        lastName:profile.lastName,
                        phone:profile.phone,
                        headline:profile.headline,
                        bio:profile.bio,
                        location:profile.location,
                        skills:profile.skills,
                        experience:profile.experience,
                        education:profile.education,
                        websiteUrl:profile.websiteUrl,
                        githubUrl:profile.githubUrl,
                        linkedinUrl:profile.linkedinUrl,
                    }
                })

            } catch (error) {
                return JSON.stringify({
                    status:"error",
                    message:error instanceof Error ? error.message:"Error in retrieving candidate profile data"
                })
            }
        },
        {
            name:"get_candidate_profile",
            description:"Fetches the candidate's full profile details including skills, work expereince, education,bio,headline, and contact links. Use this wheneve you need details to write or review a resume, suggest career advice or customize cover letters.", 
            schema:z.object({})
        }

    )
}

