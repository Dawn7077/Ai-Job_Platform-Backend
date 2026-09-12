import { Job } from "../entities/Job.js";

export interface IJobRepository{
    create(job:Job):Promise<Job>
    findById(id:string):Promise<Job|null>
    findbyCompanyId(companyId:string):Promise<Job[]>
    findAll(): Promise<Job[]>
}