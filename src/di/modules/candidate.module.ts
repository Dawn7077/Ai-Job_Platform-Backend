import { ContainerModule } from 'inversify';
import { TYPES } from '../types';

// Repositories
import { PrismaJobRepository } from '../../infrastructure/db/prisma/prisma-job.repository';
import { PrismaApplicationRepo } from '../../infrastructure/db/prisma/prisma-application.repository';
import { PrismaInterviewRepo } from '../../infrastructure/db/prisma/prisma-interview.repository';

// Services & AI
import { R2StorageService } from '../../infrastructure/services/r2-storage.service';
import { ResumeParserService } from '../../infrastructure/ai/pdf-parser.service';
import { MongoVectorSearchService } from '../../infrastructure/db/mongo/mongo-vector-search.db';
import { MentorAgent } from '../../application/agent/models/mentor-agent.model';
import { IntentClassifier } from '../../application/agent/models/classifier.model';

// UseCases
import { GetActiveJobsUseCase } from '../../application/use-case/candidate/get-all-jobs.use-case';
import { GetActiveJobById } from '../../application/use-case/candidate/get-job-details.use-case';
import { ApplyJobUseCase } from '../../application/use-case/candidate/apply-job.use-case';
import { GetAllAppicationsUseCase } from '../../application/use-case/candidate/get-all-applications.use-case';
import { GetCandidateApplication } from '../../application/use-case/candidate/get-application-details.use-case';
import { GetProfileCandidateUseCase } from '../../application/use-case/candidate/get-candidate-profile.use-case';
import { SaveCandidateProfile } from '../../application/use-case/candidate/save-candidate-profile.use-case';
import { GetCandidateInterviewUC } from '../../application/use-case/interview/get-candidate-interviews.use-case';
import { GetUploadResumeUrlUseCase } from '../../application/use-case/candidate/get-upload-resume-url.use-case';
import { ProcessResumeUseCase } from '../../application/agent/use-case/process-uploaded-resume.use-case';
import { GetResumeUrlUseCase } from '../../application/use-case/candidate/get-resume-url.use-case';
import { GetResumeTextUseCase } from '../../application/agent/use-case/get-resume-text.use-case';
import { MentorChatUseCase } from '../../application/use-case/candidate/mentor-chat.use-case';

// Controller
import { CandidateController } from '../../presentation/controller/candidate.controller';
import { PrismaMockInterview } from '../../infrastructure/db/prisma/prisma-mock-interview.repository';
import { ApplicationController } from '../../presentation/controller/application.controller';
import { MockInterviewSocketGateway } from '../../infrastructure/websocket/mock-interview-socket-gateway';
import { StartMockInterviewUseCase } from '../../application/use-case/candidate/start-mock-interview.use-case';
import { SubmitMockInterviewMessageUseCase } from '../../application/use-case/candidate/submit-mock-interview-message.use-case';
import { CompleteMockInterviewUseCase } from '../../application/use-case/candidate/complete-mock-interview.use-case';
import { GetAllMockInterviewSessionsUseCase } from '../../application/use-case/candidate/get-all-mock-sessions.use-case';

export const candidateModule = new ContainerModule(({ bind }) => {
  bind(TYPES.MockInterviewSocketGateway).to(MockInterviewSocketGateway);
  // Repositories
  bind(TYPES.IJobRepo).to(PrismaJobRepository).inSingletonScope();
  bind(TYPES.IApplicationRepo).to(PrismaApplicationRepo).inSingletonScope();
  bind(TYPES.IInterviewRepo).to(PrismaInterviewRepo).inSingletonScope();
  bind(TYPES.IMockInterviewRepo).to(PrismaMockInterview).inSingletonScope();

  bind(TYPES.IVectorSearchService)
    .to(MongoVectorSearchService)
    .inSingletonScope();
  bind(TYPES.IR2StorageService).to(R2StorageService).inSingletonScope();
  bind(TYPES.IResumeParserService).to(ResumeParserService).inSingletonScope();

  // Ai Agents
  bind(TYPES.IMentorAgent).to(MentorAgent).inSingletonScope();
  bind(TYPES.IntentClassifier).to(IntentClassifier).inSingletonScope();

  // Use Cases
  bind(TYPES.IGetActiveJobsUseCase).to(GetActiveJobsUseCase);
  bind(TYPES.IGetActiveJobById).to(GetActiveJobById);
  bind(TYPES.IApplyJobUseCase).to(ApplyJobUseCase);
  bind(TYPES.IGetAllApplicationsUseCase).to(GetAllAppicationsUseCase);
  bind(TYPES.IGetCandidateApplicationUC).to(GetCandidateApplication);
  bind(TYPES.IGetProfileCanidateUseCase).to(GetProfileCandidateUseCase);
  bind(TYPES.ISaveCandidateProfile).to(SaveCandidateProfile);
  bind(TYPES.IGetCandidateInterviewUC).to(GetCandidateInterviewUC);
  bind(TYPES.IGetUploadResumeUrlUseCase).to(GetUploadResumeUrlUseCase);
  bind(TYPES.IProcessResumeUseCase).to(ProcessResumeUseCase);
  bind(TYPES.IGetResumeUrlUseCase).to(GetResumeUrlUseCase);
  bind(TYPES.IGetResumeTextUseCase).to(GetResumeTextUseCase);
  bind(TYPES.IMentorChatUseCase).to(MentorChatUseCase);
  bind(TYPES.IStartMockInterviewUseCase).to(StartMockInterviewUseCase);
  bind(TYPES.ISubmitMockInterviewMessageUseCase).to(
    SubmitMockInterviewMessageUseCase
  );
  bind(TYPES.ICompleteMockInterviewUseCase).to(CompleteMockInterviewUseCase);
  bind(TYPES.IGetAllMockInterviewSessionsUseCase).to(
    GetAllMockInterviewSessionsUseCase
  );

  // controller
  bind(TYPES.CandidateController).to(CandidateController);
  bind(TYPES.ApplicationController).to(ApplicationController);
});
