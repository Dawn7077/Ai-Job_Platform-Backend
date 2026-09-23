import { Job } from "../../../domain/entities/Job.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";

export interface IGETActiveJobs{
    execute():Promise<Job[]>
}

export class GetActiveJobsUseCase implements IGETActiveJobs{
    constructor(private jobRepo:IJobRepository){}

    async execute():Promise<Job[]>{
        return await this.jobRepo.findAll()
    }
}


//get all jobs 