import { inject, injectable } from "inversify";
import { Job } from "../../../domain/entities/Job";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetActiveJobById } from "../../interface/I-UseCases/Candidate/IGetActiveJobById";
import { TYPES } from "../../../di/TYPES";
import { GetActiveJobRequestDTO } from "../../dtos/Candidate/Get-Active-JobId.dto";

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