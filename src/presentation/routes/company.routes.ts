import { NextFunction, Request, Response, Router } from 'express';
import { ITokenService } from '../../application/interface/services/i-token.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { UserRole } from '../../shared/constants/roles.constant';
import { CompanyController } from '../controller/company.controller';

export function CompanyRouter(
  companyController: CompanyController,
  tokenService: ITokenService
) {
  const router = Router();

  router.use(authMiddleware(tokenService));
  router.use(authorizeRole(UserRole.COMPANY));

  // profile
  router.get('/profile', (req: Request, res: Response, next: NextFunction) => {
    companyController.getProfile(req, res, next);
  });
  router.post('/profile', (req: Request, res: Response, next: NextFunction) => {
    companyController.saveProfile(req, res, next);
  });

  // jobroutes
  router.get('/jobs', (req: Request, res: Response, next: NextFunction) => {
    companyController.getJobs(req, res, next);
  });
  router.post('/jobs', (req: Request, res: Response, next: NextFunction) => {
    companyController.postJob(req, res, next);
  });
  router.put(
    '/jobs/:jobId',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.updateJob(req, res, next);
    }
  );
  router.delete(
    '/jobs/:jobId',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.deleteJob(req, res, next);
    }
  );

  // application routes

  router.get(
    '/applications',
    authorizeRole(UserRole.COMPANY),
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getAllApplications(req, res, next);
    }
  );

  router.get(
    '/application/:id/:jobId',
    authorizeRole(UserRole.COMPANY),
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getApplicationById(req, res, next);
    }
  );
  router.get(
    '/applications/:jobId',
    authorizeRole(UserRole.COMPANY),
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getApplicationByJobId(req, res, next);
    }
  );
  router.patch(
    '/applications/:id/stage',
    authorizeRole(UserRole.COMPANY),
    (req: Request, res: Response, next: NextFunction) => {
      companyController.updateApplication(req, res, next);
    }
  );

  // interview routes
  router.get(
    '/interviews',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getAllInterviews(req, res, next);
    }
  );

  router.post(
    '/applications/interview',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.scheduleInterview(req, res, next);
    }
  );
  router.get(
    '/interview/room/:roomKey',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getInterviewByRoomKey(req, res, next);
    }
  );
  router.post(
    '/interview/:interviewId/evaluation',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.submitEvaluation(req, res, next);
    }
  );
  //candidate routes
  router.get(
    '/candidates',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getAllCandidates(req, res, next);
    }
  );
  router.get(
    '/candidates/:candidateId',
    (req: Request, res: Response, next: NextFunction) => {
      companyController.getCandidateDetails(req, res, next);
    }
  );

  return router;
}
