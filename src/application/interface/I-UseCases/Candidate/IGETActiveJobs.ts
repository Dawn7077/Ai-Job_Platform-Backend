import { Job } from "../../../../domain/entities/Job";

export interface IGETActiveJobs{
    execute():Promise<Job[]>
}