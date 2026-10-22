import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { ITokenService } from '../../application/interface/services/i-token.service';
import { IAuthMiddleware } from '../middleware/auth.middleware';

export function AuthRoutes(
  authController: AuthController,
  tokenTool: ITokenService,
  authMiddleWare: IAuthMiddleware
) {
  const router = Router();

  router.post('/signup-otp', (req, res, next) => {
    authController.sendSignUpOtp(req, res, next);
  });

  router.post('/verify-signup', (req, res, next) => {
    authController.register(req, res, next);
  });

  router.post('/google-login', (req, res, next) => {
    authController.googleLogin(req, res, next);
  });

  router.post('/login', (req, res, next) => {
    authController.login(req, res, next);
  });
  router.post('/refresh', (req, res, next) => {
    authController.refreshToken(req, res, next);
  });
  router.post('/logout', (req, res, next) => {
    authController.logout(req, res, next);
  });

  router.get('/getMe', authMiddleWare(tokenTool), (req, res, next) => {
    authController.getMe(req, res, next);
  });

  router.post('/forgot-password', (req, res, next) => {
    authController.forgotPassword(req, res, next);
  });

  router.post('/reset-password', (req, res, next) => {
    authController.resetPassword(req, res, next);
  });
  router.post('/company/reapply-verification', (req, res, next) => {
    authController.reapplyVerification(req, res, next);
  });
  router.post('/run-code', (req, res, next) => {
    authController.runCode(req, res, next);
  });

  return router;
}
