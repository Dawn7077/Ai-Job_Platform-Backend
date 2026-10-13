import { ContainerModule } from "inversify";
import { CompanyController } from "../../presentation/controller/company.controller";
import { TYPES } from "../TYPES"; 
import { PrismaCompanyProfileRepo } from "../../infrastructure/db/prisma/prisma-company-profile.repository";
import { CreateJobUseCase } from "../../application/use-case/Company/create-job.use-case";
import { GetJobsTypeUseCase, GetJobsUseCase } from "../../application/use-case/Company/get-company-jobs.use-case";
import { UpdateApplicationStageUseCase } from "../../application/use-case/Company/update-application-stage.use-case";
import { GetAllApplications_Company } from "../../application/use-case/Company/get-all-company-applications.use-case";
import { GetApplication_Company } from "../../application/use-case/Company/get-application-details-company.use-case";
import { GetApplicationByJobIdUC } from "../../application/use-case/Company/get-applications-by-job-id.use-case";
import { ScheduleInterviewUC } from "../../application/use-case/Interview/schedule-interview.use-case";
import { GetInterviewByRoomKeyUC } from "../../application/use-case/Interview/get-interview-by-room-key.use-case";
import { SubmitInterviewEvaluationUC } from "../../application/use-case/Interview/submit-evaluation.use-case";
import { SaveProfileCompanyUC } from "../../application/use-case/Company/save-company-profile.use-case";
import { GetProfileCompanyUC } from "../../application/use-case/Company/get-company-profile.use-case";
import { GetCompanyInterviewUC } from "../../application/use-case/Interview/get-company-interview.use-case";
import { UpdateJobUseCase } from "../../application/use-case/Company/update-job.use-case";
import { DeleteJobUseCase } from "../../application/use-case/Company/delete-job.use-case";

export const companyModule = new ContainerModule(({bind})=>{
    bind(TYPES.ICompanyProfileRepo).to(PrismaCompanyProfileRepo).inSingletonScope()

    // use cases
    bind(TYPES.ICreateJob).to(CreateJobUseCase)
    bind(TYPES.IUpdateJobUseCase).to(UpdateJobUseCase)
    bind(TYPES.IDeleteJobUseCase).to(DeleteJobUseCase)
    bind(TYPES.IGetJobsUseCase).to(GetJobsUseCase)
    bind(TYPES.IGetJobsTypeUseCase).to(GetJobsTypeUseCase)
    bind(TYPES.IUpdateApplicationStageUseCase).to(UpdateApplicationStageUseCase)
    bind(TYPES.IGetAllApplications_Company).to(GetAllApplications_Company)
    bind(TYPES.IGetApplication_Company).to(GetApplication_Company)
    bind(TYPES.IGetApplicationByJobIdUC).to(GetApplicationByJobIdUC)
    bind(TYPES.IScheduleInterviewUC).to(ScheduleInterviewUC)
    bind(TYPES.IGetInterviewByRoomKeyUC).to(GetInterviewByRoomKeyUC)
    bind(TYPES.ISubmitInterviewEvaluationUC).to(SubmitInterviewEvaluationUC)
    bind(TYPES.ISaveProfileCompanyUC).to(SaveProfileCompanyUC)
    bind(TYPES.IGetProfileCompanyUC).to(GetProfileCompanyUC)
    bind(TYPES.IGetCompanyInterviewUC).to(GetCompanyInterviewUC)
    
    bind(TYPES.CompanyController).to(CompanyController)
})