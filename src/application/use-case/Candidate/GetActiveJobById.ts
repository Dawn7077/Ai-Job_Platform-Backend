import { Job } from "../../../domain/entities/Job.js";
import { IJobRepository } from "../../../domain/repositories/IJobRepository.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

export interface IGetActiveJobById{
    execute(jobId: string): Promise<Job>    
}
export class GetActiveJobById implements IGetActiveJobById{
    constructor(private jobRepo:IJobRepository){}

    async execute(jobId:string):Promise<Job>{
        const job = await this.jobRepo.findById(jobId)
        if(!job|| job.status!=='OPEN'){
            throw new AppError(
                "This Job posting dose not exist or is no longer active.",
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        return job
    }
}

//get job by id