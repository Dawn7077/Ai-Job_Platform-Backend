import { Application } from "../../../domain/entities/Application.js";
import { IApplicationRepository } from "../../../domain/repositories/IApplicationRepo.js";

export interface IGetCandidateALLAppications{
    execute(candidateId:string):Promise<Application[]>
}

export class GetAllAppicationsUseCase implements IGetCandidateALLAppications{
    constructor(
        private applicationRepo:IApplicationRepository,
    ){}

    async execute(candidateId:string):Promise<Application[]>{
        return this.applicationRepo.findByCandidateId(candidateId)
    }
}
//get all jobapplications of a candidate