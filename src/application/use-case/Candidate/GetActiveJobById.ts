import { inject, injectable } from "inversify";
import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetActiveJobById } from "../../interface/I-UseCases/Candidate/IGetActiveJobById";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetActiveJobById implements IGetActiveJobById{
    constructor(@inject(TYPES.IJobRepo)private jobRepo:IJobRepository){}

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