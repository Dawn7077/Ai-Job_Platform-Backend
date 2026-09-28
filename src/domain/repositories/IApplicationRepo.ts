import { Application ,ApplicationStage} from "../entities/Application.js"

 
export interface CreateApplicationInputDTO{
    jobId:string
    candidateId:string
    resumeKey?:string
}

export interface IApplicationRepository{
    create(data:CreateApplicationInputDTO):Promise<Application>
    findByCandidateAndJob(candidateId:string,jobId:string):Promise<Application|null>
    findByCandidateId(candidateId:string):Promise<Application[]> 
    findByJobId(jobId:string,stage?:ApplicationStage):Promise<Application[]>
    findById(applicationId:string):Promise<Application|null>

    findByCompanyId(companyId:string):Promise<Application[]> 
    updateApplication(applicationId:string,stage:ApplicationStage):Promise<Application>

}