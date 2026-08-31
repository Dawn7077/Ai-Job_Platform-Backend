import 'dotenv/config'
import app from './app.js' 
import { log } from 'console'
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

const PORT  = process.env.PORT || 3000
const JWTSecret = process.env.JWT_SECRET || "Default_SecretKey"


async function startApp() { 
    const prisma =new PrismaClient()
    const prismaTool = new PrismaTool(prisma)
    const BcryptTool = new BcryptService()
    const tokenTool  = new TokenService( JWTSecret)
    const refreshTool = new RefreshTokenService(prismaTool,tokenTool)
    const getMeTool = new GetMeUseCase(prismaTool)

    const registerUseCase = new Register(prismaTool,BcryptTool,tokenTool)
    const loginUseCase= new LoginUseCase(prismaTool,BcryptTool,tokenTool)

    const authControllerTool = new AuthController(registerUseCase,loginUseCase,refreshTool,tokenTool,getMeTool) 

    const userRoutes = AuthRoutes(authControllerTool,tokenTool,authMiddleware)

     

    app.use('/user',userRoutes) // for public auth routes
    // app.use('/candidate',CandidateRoute(tokenTool,candidateController))
    // app.use('/company',CompanyRouter(tokenTool,candidateController))

    app.listen(PORT,()=>{
        log(`Server running on port http://localhost:${PORT}`)
    })
}

startApp()
