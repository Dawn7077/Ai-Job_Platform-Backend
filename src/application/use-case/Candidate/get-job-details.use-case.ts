import { inject, injectable } from "inversify";
import { Job } from "../../../domain/entities/job.entity";
import { IJobRepository } from "../../../domain/repositories/i-job.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";
import { IGetActiveJobById } from "../../interface/use-cases/Candidate/i-get-jobs-by-id.use-case";
import { TYPES } from "../../../di/TYPES";
import { GetActiveJobRequestDTO } from "../../dtos/Candidate/get-active-job-id.dto";

//get job details
@injectable()
export class GetActiveJobById implements IGetActiveJobById{
    constructor(@inject(TYPES.IJobRepo)private jobRepo:IJobRepository){}

    async execute(dto:GetActiveJobRequestDTO):Promise<Job>{
        const {jobId}=dto
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