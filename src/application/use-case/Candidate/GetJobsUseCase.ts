import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IGETActiveJobs } from "../../interface/I-UseCases/Candidate/IGETActiveJobs";
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