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
import Register from './application/use-case/Register.js'
import { LoginUseCase } from './application/use-case/Login.js'
import { RefreshTokenService } from './infrastructure/services/RefreshTookenService.js'
import { AuthController } from './presentation/controller/AuthController.js' 
import { AuthRoutes } from './presentation/routes/UserRoutes.js'
import { CandidateRoute } from './presentation/routes/CandidateRoutes.js'
import { CompanyRouter } from './presentation/routes/CompanyRoutes.js'
import { GetMeUseCase } from './application/use-case/GetMe.js'
import { authMiddleware } from './presentation/middleware/authMiddleware.js'
import {ForgotPasswordUseCase} from './application/use-case/ForgotPassWord.js'
import { ResetPassswordUseCase } from './application/use-case/ResetPassword.js'
import {EmailService} from './infrastructure/services/EmailService.js'
import {SendSignUpOTPUseCase} from './application/use-case/SignUpOTP.js'
import { GoogleLoginUseCase } from './application/use-case/GoogleLoginUseCase.js'
import { Google_Service } from './infrastructure/services/GoogleAuthService.js'
import { RedisService } from './infrastructure/services/RedisService.js'
import redisClient from './infrastructure/db/redisClient.js'
import { AdminRouter } from './presentation/routes/AdminRoutes.js'
import { AdminController } from './presentation/controller/AdminController.js'
import { GetPendingUsersUseCase } from './application/use-case/GetPendingUseCase.js'
import { VerifyCompanyUseCase } from './application/use-case/VerfiyingUserCase.js'
import { CandidateController } from './presentation/controller/CandidateController.js'
import { MentorChatUseCase } from './application/use-case/MentorChatUseCase.js'
import { MentorAgent } from './application/agent/MentorAgent.js'
import { GatewayModels } from './infrastructure/gateways/GatewayModels.js'
import { IntentClassifier } from './application/agent/Classifier.js'
import { MongoVectorSearchService } from './infrastructure/services/MongoVectorSearch.js'
import { CreateJobUseCase } from './application/use-case/CreateJobUseCase.js'
import clientConnection from './infrastructure/db/MongoConnection.js'
import { PrismaJobRepository } from './infrastructure/db/PrismJobRepository.js'
import { CompanyController } from './presentation/controller/CompanyController.js'
import { GetJobsUseCase } from './application/use-case/GetCompanyJobUseCase.js'


const PORT  = process.env.PORT || 3000
const JWTSecret = process.env.JWT_SECRET || "Default_SecretKey"


async function startApp() { 
    const prismaClientConnect =new PrismaClient()
    const mongoClient  = await clientConnection
    const userRepoTool = new PrismaTool(prismaClientConnect) // prisma tool
    const jobRepo = new PrismaJobRepository(prismaClientConnect)

    const BcryptTool = new BcryptService()
    const tokenTool  = new TokenService( JWTSecret)
    const refreshTool = new RefreshTokenService(userRepoTool,tokenTool)
    const redisServiceTool = new RedisService(redisClient)

    const getMeTool = new GetMeUseCase(userRepoTool)
    const EmailServiceTool = new EmailService()
    const forgotPasswordTool = new ForgotPasswordUseCase(userRepoTool,EmailServiceTool,redisServiceTool)
    const resetPasswordTool = new ResetPassswordUseCase(userRepoTool,BcryptTool,redisServiceTool)
    const googleServiceAuth = new Google_Service()
    const GoogleServiceUseCase = new GoogleLoginUseCase(googleServiceAuth,userRepoTool,tokenTool,redisServiceTool)
    
    const getCompaniesUseCase = new GetPendingUsersUseCase(userRepoTool) 
    const verifyCompanyUseCase = new VerifyCompanyUseCase(userRepoTool) 

    const registerUseCase = new Register(userRepoTool,tokenTool,redisServiceTool)
    const signUpOTPUseCase = new SendSignUpOTPUseCase(userRepoTool,EmailServiceTool,BcryptTool,redisServiceTool)
    const loginUseCase= new LoginUseCase(userRepoTool,BcryptTool,tokenTool,redisServiceTool)

    const gatewayModel = new GatewayModels()
    const mentorAgent = new MentorAgent(gatewayModel)
    const classifierModel = new IntentClassifier(gatewayModel)
    const mentorChatUseCase = new MentorChatUseCase(classifierModel,mentorAgent,userRepoTool)

    
    const MongoServiceTool = new MongoVectorSearchService(mongoClient,gatewayModel.EmbeddingsModel)
    const createJobUseCase = new CreateJobUseCase(jobRepo,userRepoTool,MongoServiceTool)
    const getJobUseCase = new GetJobsUseCase(jobRepo)


    const authControllerTool = new AuthController(
        registerUseCase,signUpOTPUseCase,loginUseCase,
        refreshTool,tokenTool,getMeTool,
        forgotPasswordTool,resetPasswordTool,
        GoogleServiceUseCase
    ) 
    const adminControllerTool = new AdminController(getCompaniesUseCase,verifyCompanyUseCase)
    const candidateControllerTool = new CandidateController(mentorChatUseCase)
    const companyControllerTool = new CompanyController(createJobUseCase,getJobUseCase)

    
    const userRoutes = AuthRoutes(authControllerTool,tokenTool,authMiddleware)
    const adminRoutes = AdminRouter(adminControllerTool,tokenTool)
    const candidateRoutes = CandidateRoute(candidateControllerTool,tokenTool)
    const companyRoutes = CompanyRouter(companyControllerTool,tokenTool)

    app.use('/user',userRoutes) // for public auth routes
    app.use('/admin',adminRoutes)
    app.use('/candidate',candidateRoutes)
    app.use('/company',companyRoutes)

    
    app.use(errorHandler)
    app.listen(PORT,()=>{
        log(`Server running on port http://localhost:${PORT}`)
    })
}

startApp()
