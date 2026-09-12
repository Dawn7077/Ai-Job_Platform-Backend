import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Collection, MongoClient } from "mongodb";
import { IVectorSearchService, JobVectorSearchResults } from "../Interface/IVectorSearchService.js";
import { describe } from "node:test";


export class MongoVectorSearchService implements IVectorSearchService{
    private collection:Collection
    constructor(
        private mongoClient:MongoClient,
        private embeddings:GoogleGenerativeAIEmbeddings,
        db_name = 'ai_job_platform',
        collectionName = 'jobs_embeddings'
    ){
        this.collection = this.mongoClient.db(db_name).collection(collectionName)
    }
    
    //save the job embeddings to mongo vectore store 
    async indexJob(job:{
            id:string;
            title:string;
            company:string;
            description:string;
            skills:string[];
            status:string;
        }):Promise<void>
    {
        const textToEmbed = `
            Title:${job.title}\n
            Company:${job.company}\n
            Skill:${job.skills.join(', ')}\n
            Description:${job.description}\n
            Status:${job.status}\n
        `

        const vector = await this.embeddings.embedQuery(textToEmbed)

        await this.collection.updateOne(
            {jobId:job.id},
            {
                $set:{
                    jobId:job.id,
                    title:job.title,
                    company:job.company,
                    status:job.status,
                    embedding:vector,
                    updatedAt:new Date()
                }
            },
            {upsert:true}
        )
    }


    async searchJobs(query:string,limit=5):Promise<JobVectorSearchResults[]>{
        const queryVector = await this.embeddings.embedQuery(query)

        const pipeline =[
            {
                $vectorSearch:{
                    index:"vector_index",
                    path:'embedding',
                    queryVector:queryVector,
                    filter:{status:{$eq:"OPEN"}},
                    numCandidates:limit*10,
                    limit:limit
                }
            },
            {
                $project:{
                    _id:0,
                    jobId:1,
                    title:1,
                    company:1,
                    description:1,
                    score:{$meta:"vectorSearchScore"}
                }
            }
        ]

        const results = await this.collection.aggregate(pipeline).toArray()
        return results as JobVectorSearchResults[]
    }

}