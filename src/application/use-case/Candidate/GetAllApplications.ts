import { inject, injectable } from "inversify";
import { Application } from "../../../domain/entities/Application";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo";
import { IGetCandidateALLAppications } from "../../interface/I-UseCases/Candidate/IGetCandidateALLAppications";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class GetAllAppicationsUseCase implements IGetCandidateALLAppications{
    constructor(
        @inject(TYPES.IApplicationRepo) private applicationRepo:IApplicationRepository,
    ){}

    async execute(candidateId:string):Promise<Application[]>{
        return this.applicationRepo.findByCandidateId(candidateId)
    }
}
//get all jobapplications of a candidate