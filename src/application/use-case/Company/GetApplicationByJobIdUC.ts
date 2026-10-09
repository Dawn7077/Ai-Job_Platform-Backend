import { inject, injectable } from "inversify";
import { Application, ApplicationStage } from "../../../domain/entities/Application";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IGetApplicationByJobIdUC } from "../../interface/I-UseCases/Company/IGetApplicationByJobIdUC";
import { TYPES } from "../../../di/TYPES";


@injectable()
export class GetApplicationByJobIdUC implements IGetApplicationByJobIdUC{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
        @inject(TYPES.IUserRepository) private userRepo:IUserRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
    ){}

    async execute(companyId:string,jobId:string,status?:ApplicationStage){
        const company = await this.userRepo.findById(companyId)
        if(!company){
            throw new AppError(
                'Unauthorized to delete any jobs',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }
        const job = await this.jobRepo.findById(jobId)
        if(!job){
            throw new AppError(
                'Did not find any jobs posting from the provided job id ',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }

        return await this.applicationRepo.findByJobId(jobId,status)
    }
}