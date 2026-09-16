import { tool } from "@langchain/core/tools";
import {z} from 'zod'
import { IVectorSearchService } from "../../../infrastructure/Interface/IVectorSearchService.js";

export const createSearchJobTool = (vectorSearchTool:IVectorSearchService)=>{
    return tool(
        async ({query,limit})=>{
            console.log("================================")
            console.log("SEARCH JOB TOOL CALLED")
            console.log("query:", query)
            console.log("limit:", limit)
            console.log("================================")
            try {
                const results = await vectorSearchTool.searchJobs(query,limit)

                if(!results || results.length ===0){
                    return JSON.stringify({
                        status:"success",
                        count:0,
                        jobs:[],
                        message:"No matching jobs found for this query."
                    })
                }

                console.log("VECTOR SEARCH RESULTS:", results)
                return JSON.stringify({
                    status:"success",
                    count:results.length,
                    jobs:results
                })
                
            } catch (error) {
                return JSON.stringify({
                    status:"ERROR",
                    message: error instanceof Error
                            ? error.message
                            : "Error in fetching vector database."
                })
            }
        },
        {
            name:'search_jobs',
            description: `
                        Search the available job postings.

                        You MUST use this tool when the user:
                        - asks to find jobs
                        - asks for job postings
                        - asks for openings
                        - asks whether a particular role is available
                        - asks to search for a specific job title
                        - asks for jobs matching specific skills

                        Do NOT answer job-search requests from general knowledge.
                        Use this tool to retrieve the actual available job postings.
                        `,
            schema:z.object({
                query:z.string().describe("Natural language query describing the candidate's skills, desired role, or technologies." ),
                limit:z.number().describe( "Maximum number of relevant job matches to return. Use 5 unless the user asks for a specific number.")
            })
        }
    )
}