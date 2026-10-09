import dns from "node:dns";

// Force Node to use reliable public DNS servers for SRV resolution
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


import 'dotenv/config'
import app from './app' 
import { log } from 'console' 
import { errorHandler } from './presentation/middleware/errorHandler'
import { PrismaClient } from '@prisma/client'
import { PrismaTool } from './infrastructure/db/Prisma/PrismaTool'
import { BcryptService } from './infrastructure/services/BcryptService'
import { TokenService } from './infrastructure/services/TokenService'
import Register from './application/use-case/Auth/Register'
import { LoginUseCase } from './application/use-case/Auth/Login'
import { RefreshTokenService } from './infrastructure/services/RefreshTookenService'
import { AuthController } from './presentation/controller/AuthController' 
import { AuthRoutes } from './presentation/routes/UserRoutes'
import { CandidateRoute } from './presentation/routes/CandidateRoutes'
import { CompanyRouter } from './presentation/routes/CompanyRoutes'
import { GetMeUseCase } from './application/use-case/Auth/GetMe'
import { authMiddleware } from './presentation/middleware/authMiddleware'
import {ForgotPasswordUseCase} from './application/use-case/Auth/ForgotPassWord'
import { ResetPassswordUseCase } from './application/use-case/Auth/ResetPassword'
import {EmailService} from './infrastructure/services/EmailService'
import {SendSignUpOTPUseCase} from './application/use-case/Auth/SignUpOTP'
import { GoogleLoginUseCase } from './application/use-case/Auth/GoogleLoginUseCase'
import { Google_Service } from './infrastructure/services/GoogleAuthService'
import { RedisService } from './infrastructure/services/RedisService'
import redisClient from './infrastructure/db/Redis/redisClient'
import { AdminRouter } from './presentation/routes/AdminRoutes'
import { AdminController } from './presentation/controller/AdminController'
import { GetPendingUsersUseCase } from './application/use-case/Admin/GetPendingUseCase'
import { VerifyCompanyUseCase } from './application/use-case/Admin/VerfiyingUserCase'
import { CandidateController } from './presentation/controller/CandidateController'
import { MentorChatUseCase } from './application/use-case/Candidate/MentorChatUseCase'
import { MentorAgent } from './application/agent/Models/MentorAgent'
import { GatewayModels } from './infrastructure/ai/GatewayModels'
import { IntentClassifier } from './application/agent/Models/Classifier'
import { MongoVectorSearchService } from "./infrastructure/db/Mongo/MongoVectorSearch";  
import { CreateJobUseCase } from './application/use-case/Company/CreateJobUseCase'
import clientConnection from './infrastructure/db/Mongo/MongoConnection'
import { PrismaJobRepository } from './infrastructure/db/Prisma/PrismJobRepository'
import { CompanyController } from './presentation/controller/CompanyController'
import { GetJobsTypeUseCase, GetJobsUseCase } from './application/use-case/Company/GetCompanyJobUseCase'
import { ApplicationRouter } from "./presentation/routes/ApplicationRoutes";
import { ApplicationController } from "./presentation/controller/ApplicationController";
import { ApplyJobUseCase } from "./application/use-case/Candidate/ApplyJobUseCase";
import { PrismaApplicationRepo } from "./infrastructure/db/Prisma/PrismaApplicationRepo";
import { GetAllAppicationsUseCase } from "./application/use-case/Candidate/GetAllApplications";
import { GetCandidateApplication } from "./application/use-case/Candidate/GetCandidateApplication";
import { UpdateApplicationStageUseCase } from "./application/use-case/Company/UpdateApplicationStage";
import { GetAllApplications_Company } from "./application/use-case/Company/GetAllApplications_Company";
import { GetApplication_Company } from "./application/use-case/Company/GetApplication_Company";
import { GetActiveJobsUseCase } from "./application/use-case/Candidate/GetJobsUseCase";
import { GetActiveJobById } from "./application/use-case/Candidate/GetActiveJobById";
import { GetUsersUseCase } from "./application/use-case/Admin/GetUsersUseCase";
import { UpdateUserRoleUC } from "./application/use-case/Admin/UpdateUserRoleUseCase";
import { UpdateUserStatusUC } from "./application/use-case/Admin/UpdateUserStatusUseCase";
import { PrismaCandidateProfileRepo } from "./infrastructure/db/Prisma/PrismaCandidateProfile";
import { GetProfileCandidateUseCase } from "./application/use-case/Candidate/GetProfileCandidate";
import { SaveCandidateProfile } from "./application/use-case/Candidate/SaveCandidateProfile";
import { DeleteUserUseCase } from "./application/use-case/Admin/DeleteUserUseCase";
import s3Client, { R2StorageService } from "./infrastructure/services/r2StorageService";
import { ResumeParserService } from "./infrastructure/ai/pdfParserService";
import { ProcessResumeUseCase } from "./application/agent/use-case/ProcessUploadedResumeUC";
import { GetUploadResumeUrlUseCase } from "./application/use-case/Candidate/GetUploadResumeUrlUseCase";
import { GetResumeUrlUseCase } from "./application/use-case/Candidate/GetResumeUrlUseCase";
import { GetResumeTextUseCase } from "./application/agent/use-case/GetResumeTextUseCase";
import { GetApplicationByJobIdUC } from "./application/use-case/Company/GetApplicationByJobIdUC";
import { ScheduleInterviewUC } from "./application/use-case/Interview/ScheduleInterviewUseCase";
import { PrismaInterviewRepo } from "./infrastructure/db/Prisma/PrismaInterviewRepo";
import { GetInterviewByRoomKeyUC } from "./application/use-case/Interview/GetInterviewByRoomKeyUC";
import { SubmitInterviewEvaluationUC } from "./application/use-case/Interview/SubmitEvaludationUseCase";
import { SaveProfileCompanyUC } from "./application/use-case/Company/SaveProfileCompanyUC";
import { PrismaCompanyProfileRepo } from "./infrastructure/db/Prisma/CompanyProfilePrisma";
import { GetProfileCompanyUC } from "./application/use-case/Company/GetProfileCompanyUC";
import { ReapplyVerificationUseCase } from "./application/use-case/Company/ReapplyVerificationUseCase";
import { GetCompanyInterviewUC } from "./application/use-case/Interview/GetCompanyInterviewUC";
import { GetCandidateInterviewUC } from "./application/use-case/Interview/GetCandidateInterviewUC";
 
import { createServer } from 'http'
import { setUpSocket } from "./infrastructure/websocket/SignalingServer";

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

    const userRepoTool = new PrismaTool(prismaClientConnect) // prisma tool
    const jobRepo = new PrismaJobRepository(prismaClientConnect)
    const applicationRepo = new PrismaApplicationRepo(prismaClientConnect)
    const candidateProfileRepo = new PrismaCandidateProfileRepo(prismaClientConnect)
    const companyProfileRepo = new PrismaCompanyProfileRepo(prismaClientConnect)
    const interviewRepo = new PrismaInterviewRepo(prismaClientConnect)

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
    const deleteUserAdminUC = new DeleteUserUseCase(userRepoTool,jobRepo,MongoServiceTool)
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

    const authControllerTool =   container.get<AuthController>(TYPES.AuthController)
    const candidateControllerTool =  container.get<CandidateController>(TYPES.CandidateController)
    const companyControllerTool = container.get<CompanyController>(TYPES.CandidateController)
    const adminControllerTool = container.get<AdminController>(TYPES.AdminController)

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
