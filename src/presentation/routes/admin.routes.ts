import { NextFunction, Request, Response, Router } from 'express';
import { ITokenService } from '../../application/interface/services/i-token.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRole } from '../middleware/role.middleware';
import { UserRole } from '../../shared/constants/roles.constant';
import { AdminController } from '../controller/admin.controller';

export function AdminRouter(
  adminController: AdminController,
  tokenTool: ITokenService
) {
  const router = Router();
  router.use(authMiddleware(tokenTool));
  router.use(authorizeRole(UserRole.ADMIN));

  router.get(
    '/pending-companies',
    (req: Request, res: Response, next: NextFunction) => {
      adminController.getPendingUsers(req, res, next);
    }
  );

  router.post(
    '/verify-company',
    (req: Request, res: Response, next: NextFunction) => {
      adminController.verifyCompany(req, res, next);
    }
  );

  router.get('/users', (req: Request, res: Response, next: NextFunction) => {
    adminController.getUsers(req, res, next);
  });

  router.patch(
    '/users/:id/status',
    (req: Request, res: Response, next: NextFunction) => {
      adminController.updateUserStatus(req, res, next);
    }
  );

  router.patch(
    '/users/:id/role',
    (req: Request, res: Response, next: NextFunction) => {
      adminController.updateUserRole(req, res, next);
    }
  );
  router.delete(
    '/users/:id',
    (req: Request, res: Response, next: NextFunction) => {
      adminController.deleteUser(req, res, next);
    }
  );

  return router;
}
