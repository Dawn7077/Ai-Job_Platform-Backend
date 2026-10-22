import dns from 'node:dns';

// Force Node to use reliable public DNS servers for SRV resolution
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import app from './app';
import { log } from 'console';
import { errorHandler } from './presentation/middleware/error-handler.middleware';
import { AuthController } from './presentation/controller/auth.controller';
import { AuthRoutes } from './presentation/routes/user.routes';
import { CandidateRoute } from './presentation/routes/candidate.routes';
import { CompanyRouter } from './presentation/routes/company.routes';
import { authMiddleware } from './presentation/middleware/auth.middleware';
import { AdminRouter } from './presentation/routes/admin.routes';
import { AdminController } from './presentation/controller/admin.controller';
import { CandidateController } from './presentation/controller/candidate.controller';
import { CompanyController } from './presentation/controller/company.controller';
import { ApplicationRouter } from './presentation/routes/application.routes';
import { ApplicationController } from './presentation/controller/application.controller';

import { createServer } from 'http';
import { setUpSocket } from './infrastructure/websocket/interview-signaling.server';

import 'reflect-metadata';
import { container } from './di/container';
import { TYPES } from './di/types';
import { MockInterviewSocketGateway } from './infrastructure/websocket/mock-interview-socket-gateway';
import { ITokenService } from './application/interface/services/i-token.service';

const PORT = process.env.PORT || 3000;

async function startApp() {
  const server = createServer(app);
  const mockInterviewSocketGateway =
    await container.getAsync<MockInterviewSocketGateway>(
      TYPES.MockInterviewSocketGateway
    );
  setUpSocket(server, mockInterviewSocketGateway);

  const tokenTool = container.get<ITokenService>(TYPES.ITokenService);
  // const tokenTool = new TokenService(JWTSecret);

  const authControllerTool = await container.getAsync<AuthController>(
    TYPES.AuthController
  );
  const candidateControllerTool = await container.getAsync<CandidateController>(
    TYPES.CandidateController
  );
  const companyControllerTool = await container.getAsync<CompanyController>(
    TYPES.CompanyController
  );
  const adminControllerTool = await container.getAsync<AdminController>(
    TYPES.AdminController
  );
  const applicationController = await container.getAsync<ApplicationController>(
    TYPES.ApplicationController
  );

  const userRoutes = AuthRoutes(authControllerTool, tokenTool, authMiddleware);
  const adminRoutes = AdminRouter(adminControllerTool, tokenTool);
  const candidateRoutes = CandidateRoute(candidateControllerTool, tokenTool);
  const companyRoutes = CompanyRouter(companyControllerTool, tokenTool);
  const applicationRoutes = ApplicationRouter(applicationController, tokenTool);

  app.use('/user', userRoutes); // for public auth routes

  app.use('/admin', adminRoutes);
  app.use('/candidate', candidateRoutes);
  app.use('/company', companyRoutes);
  app.use('/application', applicationRoutes);

  app.use(errorHandler);
  server.listen(PORT, () => {
    log(`Server and Websocket running on port http://localhost:${PORT}`);
  });
}

startApp();
