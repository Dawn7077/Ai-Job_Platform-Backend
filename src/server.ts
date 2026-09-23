import dns from "node:dns";

// Force Node to use reliable public DNS servers for SRV resolution
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


import 'dotenv/config'
import app from './app.js' 
import { log } from 'console'
import { errorHandler } from './presentation/middleware/errorHandler.js'
import { PrismaClient } from '@prisma/client'
import { PrismaTool } from './infrastructure/db/PrismaTool.js'
import { BcryptService } from './infrastructure/services/BcryptService.js'
import { TokenService } from './infrastructure/services/TokenService.js'
import Register from './application/use-case/Auth/Register.js'
import { LoginUseCase } from './application/use-case/Auth/Login.js'
import { RefreshTokenService } from './infrastructure/services/RefreshTookenService.js'
import { AuthController } from './presentation/controller/AuthController.js' 
import { AuthRoutes } from './presentation/routes/UserRoutes.js'
import { CandidateRoute } from './presentation/routes/CandidateRoutes.js'
import { CompanyRouter } from './presentation/routes/CompanyRoutes.js'
import { GetMeUseCase } from './application/use-case/Auth/GetMe.js'
import { authMiddleware } from './presentation/middleware/authMiddleware.js'
import {ForgotPasswordUseCase} from './application/use-case/Auth/ForgotPassWord.js'
import { ResetPassswordUseCase } from './application/use-case/Auth/ResetPassword.js'
import {EmailService} from './infrastructure/services/EmailService.js'
import {SendSignUpOTPUseCase} from './application/use-case/Auth/SignUpOTP.js'
import { GoogleLoginUseCase } from './application/use-case/Auth/GoogleLoginUseCase.js'
import { Google_Service } from './infrastructure/services/GoogleAuthService.js'
import { RedisService } from './infrastructure/services/RedisService.js'
import redisClient from './infrastructure/db/redisClient.js'
import { AdminRouter } from './presentation/routes/AdminRoutes.js'
import { AdminController } from './presentation/controller/AdminController.js'
import { GetPendingUsersUseCase } from './application/use-case/Admin/GetPendingUseCase.js'
import { VerifyCompanyUseCase } from './application/use-case/Admin/VerfiyingUserCase.js'
import { CandidateController } from './presentation/controller/CandidateController.js'
import { MentorChatUseCase } from './application/use-case/Candidate/MentorChatUseCase.js'
import { MentorAgent } from './application/agent/Models/MentorAgent.js'
import { GatewayModels } from './infrastructure/gateways/GatewayModels.js'
import { IntentClassifier } from './application/agent/Models/Classifier.js'
import { MongoVectorSearchService } from './infrastructure/services/MongoVectorSearch.js'
import { CreateJobUseCase } from './application/use-case/Company/CreateJobUseCase.js'
import clientConnection from './infrastructure/db/MongoConnection.js'
import { PrismaJobRepository } from './infrastructure/db/PrismJobRepository.js'
import { CompanyController } from './presentation/controller/CompanyController.js'
import { GetJobsTypeUseCase, GetJobsUseCase } from './application/use-case/Company/GetCompanyJobUseCase.js'
import { ApplicationRouter } from "./presentation/routes/ApplicationRoutes.js";
import { ApplicationController } from "./presentation/controller/ApplicationController.js";
import { ApplyJobUseCase } from "./application/use-case/Candidate/ApplyJobUseCase.js";
import { PrismaApplicationRepo } from "./infrastructure/db/PrismaApplicationRepo.js";
import { GetAllAppicationsUseCase } from "./application/use-case/Candidate/GetAllApplications.js";
import { GetCandidateApplication } from "./application/use-case/Candidate/GetCandidateApplication.js";
import { UpdateApplicationStageUseCase } from "./application/use-case/Company/UpdateApplicationStage.js";
import { GetAllApplications_Company } from "./application/use-case/Company/GetAllApplications_Company.js";
import { GetApplication_Company } from "./application/use-case/Company/GetApplication_Company.js";
import { GetActiveJobsUseCase } from "./application/use-case/Candidate/GetJobsUseCase.js";
import { GetActiveJobById } from "./application/use-case/Candidate/GetActiveJobById.js";
import { GetUsersUseCase } from "./application/use-case/Admin/GetUsersUseCase.js";
import { UpdateUserRoleUC } from "./application/use-case/Admin/UpdateUserRoleUseCase.js";
import { UpdateUserStatusUC } from "./application/use-case/Admin/UpdateUserStatusUseCase.js";
import { PrismaCandidateProfileRepo } from "./infrastructure/db/PrismaCanidateProfile.js";
import { GetProfileCandidateUseCase } from "./application/use-case/Candidate/GetProfileCandidate.js";
import { SaveCandidateProfile } from "./application/use-case/Candidate/SaveCandidateProfile.js";
import { DeleteUserUseCase } from "./application/use-case/Admin/DeleteUserUseCase.js";


const PORT  = process.env.PORT || 3000
const JWTSecret = process.env.JWT_SECRET || "Default_SecretKey"


async function startApp() { 
    const prismaClientConnect =new PrismaClient()
    const mongoClient  = await clientConnection
    const userRepoTool = new PrismaTool(prismaClientConnect) // prisma tool
    const jobRepo = new PrismaJobRepository(prismaClientConnect)
    const applicationRepo = new PrismaApplicationRepo(prismaClientConnect)
    const candidateProfileRepo = new PrismaCandidateProfileRepo(prismaClientConnect)

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
    
    // candidate Ai use case
    const gatewayModel = new GatewayModels()
    const MongoServiceTool = new MongoVectorSearchService(mongoClient,gatewayModel.EmbeddingsModel)
    
    const mentorAgent = new MentorAgent(gatewayModel,MongoServiceTool,applyJobCandidateuseCase,getAllApplicationUseCase,getCandidateApplicationuseCase,getCandidateProfileUseCase)
    const classifierModel = new IntentClassifier(gatewayModel)
    const mentorChatUseCase = new MentorChatUseCase(classifierModel,mentorAgent,userRepoTool)
    
    
    
    //admin use
    const getCompaniesUseCase = new GetPendingUsersUseCase(userRepoTool) 
    const verifyCompanyUseCase = new VerifyCompanyUseCase(userRepoTool) 
    const getUsersAdminUC = new GetUsersUseCase(userRepoTool)
    const updateUsersStatusAdminUC = new UpdateUserStatusUC(userRepoTool)
    const updateUserRoleAdminUC = new UpdateUserRoleUC(userRepoTool)
    const deleteUserAdminUC = new DeleteUserUseCase(userRepoTool,jobRepo,MongoServiceTool)

    
    
    //company Job UseCases
    const createJobUseCase = new CreateJobUseCase(jobRepo,userRepoTool,MongoServiceTool)
    const getJobUseCase = new GetJobsUseCase(jobRepo)
    const getJobTypeUseCase = new GetJobsTypeUseCase(jobRepo)

    const updateApplicationUseCase = new UpdateApplicationStageUseCase(applicationRepo,jobRepo)
    const getCompanyApplicationAllUseCase = new GetAllApplications_Company(applicationRepo)
    const getCompanyApplicationUseCase = new GetApplication_Company(applicationRepo,jobRepo)

    
    //controllers
    const authControllerTool = new AuthController(
        registerUseCase,signUpOTPUseCase,loginUseCase,
        refreshTool,tokenTool,getMeTool,
        forgotPasswordTool,resetPasswordTool,
        GoogleServiceUseCase
    ) 
    const adminControllerTool = new AdminController(getCompaniesUseCase,verifyCompanyUseCase,updateUsersStatusAdminUC,updateUserRoleAdminUC,getUsersAdminUC,deleteUserAdminUC)
    const candidateControllerTool = new CandidateController(mentorChatUseCase,getAllJobUseCase,getJobActiveDetailsUseCase,saveCandidateProfileUseCase,getCandidateProfileUseCase)
    const companyControllerTool = new CompanyController(createJobUseCase,getJobUseCase)
    const applicationController = new ApplicationController(
        applyJobCandidateuseCase,getAllApplicationUseCase
        ,getCandidateApplicationuseCase,updateApplicationUseCase,
        getCompanyApplicationAllUseCase,getCompanyApplicationUseCase
    )

    
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
    app.listen(PORT,()=>{
        log(`Server running on port http://localhost:${PORT}`)
    })
}


startApp()
