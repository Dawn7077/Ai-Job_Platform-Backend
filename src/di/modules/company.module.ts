import { ContainerModule } from 'inversify';
import { CompanyController } from '../../presentation/controller/company.controller';
import { TYPES } from '../types';
import { PrismaCompanyProfileRepo } from '../../infrastructure/db/prisma/prisma-company-profile.repository';
import { CreateJobUseCase } from '../../application/use-case/company/create-job.use-case';
import {
  GetJobsTypeUseCase,
  GetJobsUseCase,
} from '../../application/use-case/company/get-company-jobs.use-case';
import { UpdateApplicationStageUseCase } from '../../application/use-case/company/update-application-stage.use-case';
import { GetAllCompanyApplicationsUseCase } from '../../application/use-case/company/get-all-company-applications.use-case';
import { GetCompanyApplicationDetailsUseCase } from '../../application/use-case/company/get-application-details-company.use-case';
import { GetApplicationByJobIdUseCase } from '../../application/use-case/company/get-applications-by-job-id.use-case';
import { ScheduleInterviewUC } from '../../application/use-case/interview/schedule-interview.use-case';
import { GetInterviewByRoomKeyUC } from '../../application/use-case/interview/get-interview-by-room-key.use-case';
import { SubmitInterviewEvaluationUC } from '../../application/use-case/interview/submit-evaluation.use-case';
import { SaveCompanyProfileUseCase } from '../../application/use-case/company/save-company-profile.use-case';
import { GetCompanyProfileUseCase } from '../../application/use-case/company/get-company-profile.use-case';
import { GetCompanyInterviewUC } from '../../application/use-case/interview/get-company-interview.use-case';
import { UpdateJobUseCase } from '../../application/use-case/company/update-job.use-case';
import { DeleteJobUseCase } from '../../application/use-case/company/delete-job.use-case';
import { GetAllCandidatesUseCase } from '../../application/use-case/company/get-all-candidates.use-case';
import { GetCandidateDetailsUseCase } from '../../application/use-case/company/get-candidate-details.use-case';

export const companyModule = new ContainerModule(({ bind }) => {
  bind(TYPES.ICompanyProfileRepo)
    .to(PrismaCompanyProfileRepo)
    .inSingletonScope();

  // use cases
  bind(TYPES.ICreateJob).to(CreateJobUseCase);
  bind(TYPES.IUpdateJobUseCase).to(UpdateJobUseCase);
  bind(TYPES.IDeleteJobUseCase).to(DeleteJobUseCase);
  bind(TYPES.IGetJobsUseCase).to(GetJobsUseCase);
  bind(TYPES.IGetJobsTypeUseCase).to(GetJobsTypeUseCase);
  bind(TYPES.IUpdateApplicationStageUseCase).to(UpdateApplicationStageUseCase);
  bind(TYPES.IGetAllApplications_Company).to(GetAllCompanyApplicationsUseCase);
  bind(TYPES.IGetApplication_Company).to(GetCompanyApplicationDetailsUseCase);
  bind(TYPES.IGetApplicationByJobIdUC).to(GetApplicationByJobIdUseCase);
  bind(TYPES.IScheduleInterviewUC).to(ScheduleInterviewUC);
  bind(TYPES.IGetInterviewByRoomKeyUC).to(GetInterviewByRoomKeyUC);
  bind(TYPES.ISubmitInterviewEvaluationUC).to(SubmitInterviewEvaluationUC);
  bind(TYPES.ISaveProfileCompanyUC).to(SaveCompanyProfileUseCase);
  bind(TYPES.IGetProfileCompanyUC).to(GetCompanyProfileUseCase);
  bind(TYPES.IGetCompanyInterviewUC).to(GetCompanyInterviewUC);
  bind(TYPES.IGetAllCandidatesUseCase).to(GetAllCandidatesUseCase);
  bind(TYPES.IGetCandidateDetailsUseCase).to(GetCandidateDetailsUseCase);

  bind(TYPES.CompanyController).to(CompanyController);
});
