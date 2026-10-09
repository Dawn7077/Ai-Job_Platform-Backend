import { ContainerModule } from "inversify";
import { CompanyController } from "../../presentation/controller/CompanyController";
import { TYPES } from "../TYPES"; 
import { PrismaCompanyProfileRepo } from "../../infrastructure/db/Prisma/CompanyProfilePrisma";
import { CreateJobUseCase } from "../../application/use-case/Company/CreateJobUseCase";
import { GetJobsTypeUseCase, GetJobsUseCase } from "../../application/use-case/Company/GetCompanyJobUseCase";
import { UpdateApplicationStageUseCase } from "../../application/use-case/Company/UpdateApplicationStage";
import { GetAllApplications_Company } from "../../application/use-case/Company/GetAllApplications_Company";
import { GetApplication_Company } from "../../application/use-case/Company/GetApplication_Company";
import { GetApplicationByJobIdUC } from "../../application/use-case/Company/GetApplicationByJobIdUC";
import { ScheduleInterviewUC } from "../../application/use-case/Interview/ScheduleInterviewUseCase";
import { GetInterviewByRoomKeyUC } from "../../application/use-case/Interview/GetInterviewByRoomKeyUC";
import { SubmitInterviewEvaluationUC } from "../../application/use-case/Interview/SubmitEvaludationUseCase";
import { SaveProfileCompanyUC } from "../../application/use-case/Company/SaveProfileCompanyUC";
import { GetProfileCompanyUC } from "../../application/use-case/Company/GetProfileCompanyUC";
import { GetCompanyInterviewUC } from "../../application/use-case/Interview/GetCompanyInterviewUC";

export const companyModule = new ContainerModule(({bind})=>{
    bind(TYPES.ICompanyProfileRepo).to(PrismaCompanyProfileRepo).inSingletonScope()

    // use cases
    bind(TYPES.ICreateJob).to(CreateJobUseCase)
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