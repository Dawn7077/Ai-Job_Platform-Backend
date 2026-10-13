import dns from "node:dns";

// Force Node to use reliable public DNS servers for SRV resolution
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


import 'dotenv/config'
import app from './app' 
import { log } from 'console' 
import { errorHandler } from './presentation/middleware/error-handler.middleware'
import { PrismaClient } from '@prisma/client'
import { PrismaTool } from './infrastructure/db/prisma/prisma-user.repository'
import { BcryptService } from './infrastructure/services/bcrypt.service'
import { TokenService } from './infrastructure/services/token.service'
import Register from './application/use-case/Auth/register.use-case'
import { LoginUseCase } from './application/use-case/Auth/login.use-case'
import { RefreshTokenService } from './infrastructure/services/refresh-token.service'
import { AuthController } from './presentation/controller/auth.controller' 
import { AuthRoutes } from './presentation/routes/user.routes'
import { CandidateRoute } from './presentation/routes/candidate.routes'
import { CompanyRouter } from './presentation/routes/company.routes'
import { GetMeUseCase } from './application/use-case/Auth/get-me.use-case'
import { authMiddleware } from './presentation/middleware/auth.middleware'
import {ForgotPasswordUseCase} from './application/use-case/Auth/forgot-password.use-case'
import { ResetPassswordUseCase } from './application/use-case/Auth/reset-password.use-case'
import {EmailService} from './infrastructure/services/email.service'
import {SendSignUpOTPUseCase} from './application/use-case/Auth/signup-otp.use-case'
import { GoogleLoginUseCase } from './application/use-case/Auth/google-login.use-case'
import { Google_Service } from './infrastructure/services/google-auth.service'
import { RedisService } from './infrastructure/services/redis.service'
import redisClient from './infrastructure/db/Redis/redis-client.db'
import { AdminRouter } from './presentation/routes/admin.routes'
import { AdminController } from './presentation/controller/admin.controller'
import { GetPendingUsersUseCase } from './application/use-case/Admin/get-pending.use-case'
import { VerifyCompanyUseCase } from './application/use-case/Admin/verify-user.use-case'
import { CandidateController } from './presentation/controller/candidate.controller'
import { MentorChatUseCase } from './application/use-case/Candidate/mentor-chat.use-case'
import { MentorAgent } from './application/agent/models/mentor-agent.model'
import { GatewayModels } from './infrastructure/ai/gateway.models'
import { IntentClassifier } from './application/agent/models/classifier.model'
import { MongoVectorSearchService } from "./infrastructure/db/mongo/mongo-vector-search.db";  
import { CreateJobUseCase } from './application/use-case/Company/create-job.use-case'
import clientConnection from './infrastructure/db/mongo/mongo-connection.db'
import { PrismaJobRepository } from './infrastructure/db/prisma/prisma-job.repository'
import { CompanyController } from './presentation/controller/company.controller'
import { GetJobsTypeUseCase, GetJobsUseCase } from './application/use-case/Company/get-company-jobs.use-case'
import { ApplicationRouter } from "./presentation/routes/application.routes";
import { ApplicationController } from "./presentation/controller/application.controller";
import { ApplyJobUseCase } from "./application/use-case/Candidate/apply-job.use-case";
import { PrismaApplicationRepo } from "./infrastructure/db/prisma/prisma-application.repository";
import { GetAllAppicationsUseCase } from "./application/use-case/Candidate/get-all-applications.use-case";
import { GetCandidateApplication } from "./application/use-case/Candidate/get-application-details.use-case";
import { UpdateApplicationStageUseCase } from "./application/use-case/Company/update-application-stage.use-case";
import { GetAllApplications_Company } from "./application/use-case/Company/get-all-company-applications.use-case";
import { GetApplication_Company } from "./application/use-case/Company/get-application-details-company.use-case";
import { GetActiveJobsUseCase } from "./application/use-case/Candidate/get-all-jobs.use-case";
import { GetActiveJobById } from "./application/use-case/Candidate/get-job-details.use-case";
import { GetUsersUseCase } from "./application/use-case/Admin/get-users.use-case";
import { UpdateUserRoleUC } from "./application/use-case/Admin/update-user-role.use-case";
import { UpdateUserStatusUC } from "./application/use-case/Admin/update-user-status.use-case";
import { PrismaCandidateProfileRepo } from "./infrastructure/db/prisma/prisma-candidate-profile.repository";
import { GetProfileCandidateUseCase } from "./application/use-case/Candidate/get-candidate-profile.use-case";
import { SaveCandidateProfile } from "./application/use-case/Candidate/save-candidate-profile.use-case";
import { DeleteUserUseCase } from "./application/use-case/Admin/delete-user.use-case";
import s3Client, { R2StorageService } from "./infrastructure/services/r2-storage.service";
import { ResumeParserService } from "./infrastructure/ai/pdf-parser.service";
import { ProcessResumeUseCase } from "./application/agent/use-case/process-uploaded-resume.use-case";
import { GetUploadResumeUrlUseCase } from "./application/use-case/Candidate/get-upload-resume-url.use-case";
import { GetResumeUrlUseCase } from "./application/use-case/Candidate/get-resume-url.use-case";
import { GetResumeTextUseCase } from "./application/agent/use-case/get-resume-text.use-case";
import { GetApplicationByJobIdUC } from "./application/use-case/Company/get-applications-by-job-id.use-case";
import { ScheduleInterviewUC } from "./application/use-case/Interview/schedule-interview.use-case";
import { PrismaInterviewRepo } from "./infrastructure/db/prisma/prisma-interview.repository";
import { GetInterviewByRoomKeyUC } from "./application/use-case/Interview/get-interview-by-room-key.use-case";
import { SubmitInterviewEvaluationUC } from "./application/use-case/Interview/submit-evaluation.use-case";
import { SaveProfileCompanyUC } from "./application/use-case/Company/save-company-profile.use-case";
import { PrismaCompanyProfileRepo } from "./infrastructure/db/prisma/prisma-company-profile.repository";
import { GetProfileCompanyUC } from "./application/use-case/Company/get-company-profile.use-case";
import { ReapplyVerificationUseCase } from "./application/use-case/Company/reapply-verification.use-case";
import { GetCompanyInterviewUC } from "./application/use-case/Interview/get-company-interview.use-case";
import { GetCandidateInterviewUC } from "./application/use-case/Interview/get-candidate-interviews.use-case";
 
import { createServer } from 'http'
import { setUpSocket } from "./infrastructure/websocket/signaling.server";

import 'reflect-metadata'
import {container} from './di/container'
import {TYPES} from './di/TYPES'

const PORT  = process.env.PORT || 3000
const JWTSecret = process.env.JWT_SECRET || "Default_SecretKey"


async function startApp() { 
    const server = createServer(app)
    setUpSocket(server)
     

    const prismaClientConnect =new PrismaClient()
    const mongoClient  = await clientConnection
    const s3clientConnect = await s3Client

    const userRepoTool = new PrismaTool( prismaClientConnect) // prisma tool
    const jobRepo = new PrismaJobRepository( prismaClientConnect)
    const applicationRepo = new PrismaApplicationRepo( prismaClientConnect)
    const candidateProfileRepo = new PrismaCandidateProfileRepo( prismaClientConnect)
    const companyProfileRepo = new PrismaCompanyProfileRepo( prismaClientConnect)
    const interviewRepo = new PrismaInterviewRepo(prismaClientConnect )

    const gatewayModel = new GatewayModels()
    const MongoServiceTool = new MongoVectorSearchService(mongoClient,gatewayModel.EmbeddingsModel)
    

    const BcryptTool = new BcryptService()
    const tokenTool  = new TokenService( JWTSecret)
    const refreshTool = new RefreshTokenService(userRepoTool,tokenTool)
    const redisServiceTool = new RedisService(redisClient)

    const getMeTool = new GetMeUseCase(userRepoTool)
    const EmailServiceTool = new EmailService()
    const forgotPasswordTool = new ForgotPasswordUseCase(userRepoTool,EmailServiceTool,redisServiceTool)
    const resetPasswordTool = new ResetPassswordUseCase(userRepoTool,BcryptTool,redisServiceTool)
    const googleServiceAuth = new Google_Service()
    const GoogleServiceUseCase = new GoogleLoginUseCase(googleServiceAuth,userRepoTool,candidateProfileRepo,tokenTool,redisServiceTool)
    
    
    const r2Service = new R2StorageService(s3clientConnect)
    const parserService = new ResumeParserService()


    //auth use case
    const registerUseCase = new Register(userRepoTool,tokenTool,redisServiceTool)
    const signUpOTPUseCase = new SendSignUpOTPUseCase(userRepoTool,EmailServiceTool,BcryptTool,redisServiceTool)
    const loginUseCase= new LoginUseCase(userRepoTool,candidateProfileRepo,BcryptTool,tokenTool,redisServiceTool)
    
    
    
    // candidate jobs/application usecases 
    const getAllJobUseCase = new GetActiveJobsUseCase(jobRepo)
    const getJobActiveDetailsUseCase = new GetActiveJobById(jobRepo)
    const applyJobCandidateuseCase = new ApplyJobUseCase(applicationRepo,jobRepo)
    const getAllApplicationUseCase = new GetAllAppicationsUseCase(applicationRepo)
    const getCandidateApplicationuseCase = new GetCandidateApplication(applicationRepo,jobRepo)
    
    const getCandidateProfileUseCase = new GetProfileCandidateUseCase(candidateProfileRepo)
    const saveCandidateProfileUseCase = new SaveCandidateProfile(candidateProfileRepo)
    const getCandidateInterviewUC = new GetCandidateInterviewUC(interviewRepo)

    //resume
    const uploadResumeUrlUseCase = new GetUploadResumeUrlUseCase(r2Service)
    const processResumeUseCase = new ProcessResumeUseCase(candidateProfileRepo,parserService,gatewayModel,r2Service)
    const getResumeUrlUseCase = new GetResumeUrlUseCase(r2Service,candidateProfileRepo)
    
    // candidate Ai use case
    const getResumeTextUseCase = new GetResumeTextUseCase(r2Service,candidateProfileRepo,parserService)
    
    const mentorAgent = new MentorAgent(gatewayModel,MongoServiceTool,applyJobCandidateuseCase,getAllApplicationUseCase,
        getCandidateApplicationuseCase,getCandidateProfileUseCase,
        getResumeTextUseCase,
    )
    const classifierModel = new IntentClassifier(gatewayModel)
    const mentorChatUseCase = new MentorChatUseCase(classifierModel,mentorAgent,userRepoTool)
    
    
    
    //admin use
    const getCompaniesUseCase = new GetPendingUsersUseCase(userRepoTool) 
    const verifyCompanyUseCase = new VerifyCompanyUseCase(userRepoTool) 
    const getUsersAdminUC = new GetUsersUseCase(userRepoTool)
    const updateUsersStatusAdminUC = new UpdateUserStatusUC(userRepoTool)
    const updateUserRoleAdminUC = new UpdateUserRoleUC(userRepoTool)
    const deleteUserAdminUC = new DeleteUserUseCase(userRepoTool,jobRepo,MongoServiceTool,redisServiceTool)
    const reapplyVerificationUC = new ReapplyVerificationUseCase(userRepoTool)

    
    
    //company Job UseCases
    const createJobUseCase = new CreateJobUseCase(jobRepo,userRepoTool,MongoServiceTool)
    const getJobUseCase = new GetJobsUseCase(jobRepo)
    const getJobTypeUseCase = new GetJobsTypeUseCase(jobRepo)
    
    const updateApplicationUseCase = new UpdateApplicationStageUseCase(applicationRepo,jobRepo)
    const getCompanyApplicationAllUseCase = new GetAllApplications_Company(applicationRepo)
    const getCompanyApplicationUseCase = new GetApplication_Company(applicationRepo,jobRepo)
    const getApplicationsByJobIdUC = new GetApplicationByJobIdUC(applicationRepo,userRepoTool,jobRepo)
    const scheduleInterviewUseCase = new ScheduleInterviewUC(interviewRepo,applicationRepo)
    const getRoomKeyUseCase = new GetInterviewByRoomKeyUC(interviewRepo)
    const submitInterviewEvalUC = new SubmitInterviewEvaluationUC(interviewRepo)
    const saveProfileCompanyUC = new SaveProfileCompanyUC(companyProfileRepo)
    const getProfileCompanyUC = new GetProfileCompanyUC(companyProfileRepo)
    const getCompanyInterviewUC = new GetCompanyInterviewUC(interviewRepo)

    
    //controllers
    // const authControllerTool = new AuthController(
    //     registerUseCase,signUpOTPUseCase,loginUseCase,
    //     refreshTool,tokenTool,getMeTool,
    //     forgotPasswordTool,resetPasswordTool,
    //     GoogleServiceUseCase,reapplyVerificationUC,
    // ) 
    // const candidateControllerTool = new CandidateController(
    //     mentorChatUseCase,getAllJobUseCase,getJobActiveDetailsUseCase,
    //     saveCandidateProfileUseCase,getCandidateProfileUseCase,
    //     uploadResumeUrlUseCase,processResumeUseCase,getResumeUrlUseCase,
    //     getCandidateInterviewUC
    // )

    // const adminControllerTool = new AdminController(getCompaniesUseCase,verifyCompanyUseCase,updateUsersStatusAdminUC,updateUserRoleAdminUC,getUsersAdminUC,deleteUserAdminUC)
    
    // const companyControllerTool = new CompanyController(
    //     createJobUseCase,getJobUseCase,getCompanyApplicationAllUseCase,
    //     getApplicationsByJobIdUC,getCompanyApplicationUseCase,updateApplicationUseCase,
    //     scheduleInterviewUseCase,getRoomKeyUseCase,submitInterviewEvalUC,
    //     saveProfileCompanyUC,getProfileCompanyUC,
    //     getCompanyInterviewUC
    // ) 
    
    const applicationController = new ApplicationController(
        applyJobCandidateuseCase,getAllApplicationUseCase
        ,getCandidateApplicationuseCase
    )

    const authControllerTool = await  container.getAsync<AuthController>(TYPES.AuthController)
    const candidateControllerTool =  await container.getAsync<CandidateController>(TYPES.CandidateController)
    const companyControllerTool = await container.getAsync<CompanyController>(TYPES.CompanyController)
    const adminControllerTool = await container.getAsync<AdminController>(TYPES.AdminController)

    const userRoutes = AuthRoutes(authControllerTool,tokenTool,authMiddleware)
    const adminRoutes = AdminRouter(adminControllerTool,tokenTool)
    const candidateRoutes = CandidateRoute(candidateControllerTool,tokenTool)
    const companyRoutes = CompanyRouter(companyControllerTool,tokenTool)
    const applicationRoutes = ApplicationRouter(applicationController,tokenTool)

    app.use('/user',userRoutes) // for public auth routes

    app.use('/admin',adminRoutes)
    app.use('/candidate',candidateRoutes)
    app.use('/company',companyRoutes)
    app.use('/application',applicationRoutes)

    
    app.use(errorHandler)
    server.listen(PORT,()=>{
        log(`Server and Websocket running on port http://localhost:${PORT}`)
    })
}


startApp()
