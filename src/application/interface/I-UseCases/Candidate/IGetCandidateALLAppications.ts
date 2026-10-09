import { Application } from "../../../../domain/entities/Application";

export interface IGetCandidateALLAppications{
    execute(candidateId:string):Promise<Application[]>
}