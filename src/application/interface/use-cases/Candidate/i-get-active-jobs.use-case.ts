import { Job } from "../../../../domain/entities/job.entity";

export interface IGETActiveJobs{
    execute():Promise<Job[]>
}