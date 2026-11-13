import dns from 'node:dns';

// Force Node to use reliable public DNS servers for SRV resolution in local dev if needed
dns.setDefaultResultOrder('ipv4first');
if (
  process.env.OVERRIDE_DNS === 'true' ||
  (process.env.NODE_ENV !== 'production' && !process.env.RAILWAY_ENVIRONMENT)
) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch {
    // Fall back to default system DNS
  }
}

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
import promClient from 'prom-client';
import 'reflect-metadata';
import { container } from './di/container';
import { TYPES } from './di/types';
import { MockInterviewSocketGateway } from './infrastructure/websocket/mock-interview-socket-gateway';
import { ITokenService } from './application/interface/services/i-token.service';
import { RateLimiterMiddleware } from './presentation/middleware/rate-limiter.middleware';

const PORT = process.env.PORT || 3000;

async function startApp() {
  promClient.collectDefaultMetrics({ prefix: 'ai_job_backend_' });
  const server = createServer(app);
  const mockInterviewSocketGateway =
    await container.getAsync<MockInterviewSocketGateway>(
      TYPES.MockInterviewSocketGateway
    );
  setUpSocket(server, mockInterviewSocketGateway);

  const tokenTool = container.get<ITokenService>(TYPES.ITokenService);
  const rateLimitMiddleware = container.get<RateLimiterMiddleware>(
    TYPES.RateLimiterMiddleware
  );
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

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });

  const userRoutes = AuthRoutes(authControllerTool, tokenTool, authMiddleware);
  const adminRoutes = AdminRouter(adminControllerTool, tokenTool);
  const candidateRoutes = CandidateRoute(
    candidateControllerTool,
    tokenTool,
    rateLimitMiddleware
  );
  const companyRoutes = CompanyRouter(companyControllerTool, tokenTool);
  const applicationRoutes = ApplicationRouter(applicationController, tokenTool);

  app.use('/user', userRoutes); // for public auth routes

  app.use('/admin', adminRoutes);
  app.use('/candidate', candidateRoutes);
  app.use('/company', companyRoutes);
  app.use('/application', applicationRoutes);

  app.use(errorHandler);
  const listenPort = Number(PORT) || 3000;
  server.listen(listenPort, '0.0.0.0', () => {
    log(`Server and Websocket running on port http://0.0.0.0:${listenPort}`);
  });
}

startApp();
