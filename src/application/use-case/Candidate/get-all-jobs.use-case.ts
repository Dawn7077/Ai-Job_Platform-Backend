import { Job } from "../../../domain/entities/job.entity";
import { IJobRepository } from "../../../domain/repositories/i-job.repository";
import { IGETActiveJobs } from "../../interface/use-cases/Candidate/i-get-active-jobs.use-case";
import { injectable,inject } from "inversify";
import {TYPES} from '../../../di/TYPES'


@injectable()
export class GetActiveJobsUseCase implements IGETActiveJobs{
    constructor(@inject(TYPES.IJobRepo) private jobRepo:IJobRepository){}

    async execute():Promise<Job[]>{
        return await this.jobRepo.findAll()
    }
}


//get all jobs 