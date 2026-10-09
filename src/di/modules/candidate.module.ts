import { ContainerModule } from "inversify";
import {TYPES} from'../TYPES'


// Repositories 
import { PrismaJobRepository } from "../../infrastructure/db/Prisma/PrismJobRepository";
import { PrismaCandidateProfileRepo } from "../../infrastructure/db/Prisma/PrismaCandidateProfile";
import { PrismaApplicationRepo } from "../../infrastructure/db/Prisma/PrismaApplicationRepo";
import { PrismaInterviewRepo } from "../../infrastructure/db/Prisma/PrismaInterviewRepo";

// Services & AI
import { R2StorageService } from "../../infrastructure/services/r2StorageService";
import { ResumeParserService } from "../../infrastructure/ai/pdfParserService";
import { MongoVectorSearchService } from "../../infrastructure/db/Mongo/MongoVectorSearch";  
import { GatewayModels } from "../../infrastructure/ai/GatewayModels";
import { MentorAgent } from "../../application/agent/Models/MentorAgent";
import { IntentClassifier } from "../../application/agent/Models/Classifier";

// UseCases
import { GetActiveJobsUseCase } from "../../application/use-case/Candidate/GetJobsUseCase";
import { GetActiveJobById } from "../../application/use-case/Candidate/GetActiveJobById";
import { ApplyJobUseCase } from "../../application/use-case/Candidate/ApplyJobUseCase";
import { GetAllAppicationsUseCase } from "../../application/use-case/Candidate/GetAllApplications";
import { GetCandidateApplication } from "../../application/use-case/Candidate/GetCandidateApplication";
import { GetProfileCandidateUseCase } from "../../application/use-case/Candidate/GetProfileCandidate";
import { SaveCandidateProfile } from "../../application/use-case/Candidate/SaveCandidateProfile";
import { GetCandidateInterviewUC } from "../../application/use-case/Interview/GetCandidateInterviewUC";
import { GetUploadResumeUrlUseCase } from "../../application/use-case/Candidate/GetUploadResumeUrlUseCase";
import { ProcessResumeUseCase } from "../../application/agent/use-case/ProcessUploadedResumeUC";
import { GetResumeUrlUseCase } from "../../application/use-case/Candidate/GetResumeUrlUseCase";
import { GetResumeTextUseCase } from "../../application/agent/use-case/GetResumeTextUseCase";
import { MentorChatUseCase } from "../../application/use-case/Candidate/MentorChatUseCase";

// Controller
import { CandidateController } from "../../presentation/controller/CandidateController";

export const candidateModule = new ContainerModule(({bind})=>{
    // Repositories
    bind(TYPES.IJobRepo).to(PrismaJobRepository).inSingletonScope() 
    bind(TYPES.IApplicationRepo).to(PrismaApplicationRepo).inSingletonScope()
    bind(TYPES.IInterviewRepo).to(PrismaInterviewRepo).inSingletonScope()

    bind(TYPES.IVectorSearchService).to(MongoVectorSearchService).inSingletonScope()
    bind(TYPES.IR2StorageService).to(R2StorageService).inSingletonScope()
    bind(TYPES.IResumeParserService).to(ResumeParserService).inSingletonScope()
    
    // Ai Agents
    bind(TYPES.IMentorAgent).to(MentorAgent).inSingletonScope()
    bind(TYPES.IntentClassifier).to(IntentClassifier).inSingletonScope()
    
    // Use Cases
    bind(TYPES.IGetActiveJobsUseCase).to(GetActiveJobsUseCase) 
    bind(TYPES.IGetActiveJobById).to(GetActiveJobById) 
    bind(TYPES.IApplyJobUseCase).to(ApplyJobUseCase) 
    bind(TYPES.IGetAllApplicationsUseCase).to(GetAllAppicationsUseCase) 
    bind(TYPES.IGetCandidateApplicationUC).to(GetCandidateApplication)
    bind(TYPES.IGetProfileCanidateUseCase).to(GetProfileCandidateUseCase)
    bind(TYPES.ISaveCandidateProfile).to(SaveCandidateProfile)
    bind(TYPES.IGetCandidateInterviewUC).to(GetCandidateInterviewUC)
    bind(TYPES.IGetUploadResumeUrlUseCase).to(GetUploadResumeUrlUseCase)
    bind(TYPES.IProcessResumeUseCase).to(ProcessResumeUseCase)
    bind(TYPES.IGetResumeUrlUseCase).to(GetResumeUrlUseCase)
    bind(TYPES.IGetResumeTextUseCase).to(GetResumeTextUseCase)
    bind(TYPES.IMentorChatUseCase).to(MentorChatUseCase)
    

    // controller
    bind(TYPES.CandidateController).to(CandidateController)
})