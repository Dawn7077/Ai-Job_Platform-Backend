export interface JobVectorSearchResults{
    jobId:string
    title:string
    company:string
    description:string
    score:number
}


export interface IVectorSearchService{
    searchJobs(query:string,limit?:number):Promise<JobVectorSearchResults[]>

    indexJob(job:{
        id:string;
        title:string;
        company:string;
        description:string;
        skills:string[];
        status:string;
    }):Promise<void>
}
