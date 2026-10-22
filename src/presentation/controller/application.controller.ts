import { NextFunction, Request, Response } from 'express';
import { IApplyJobUseCase } from '../../application/interface/use-cases/candidate/i-apply-job.use-case';
import { StatusCode } from '../../shared/constants/status-code.constant';
import { IGetCandidateALLAppications } from '../../application/interface/use-cases/candidate/i-get-candidate-all-applications.use-case';
import { IGetCandidateApplication } from '../../application/interface/use-cases/candidate/i-get-candidate-application.use-case';
import { ApplyJobSchema } from '../../application/dtos/candidate/apply-job.dto';
import { GetCandidateApplicationSchema } from '../../application/dtos/candidate/get-all-applications.dto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { ResponseHelper } from '../../shared/models/response.model';

@injectable()
export class ApplicationController {
  constructor(
    @inject(TYPES.IApplyJobUseCase) private applyJobUseCase: IApplyJobUseCase,
    @inject(TYPES.IGetAllApplicationsUseCase)
    private getAllApplicationsUseCase: IGetCandidateALLAppications,
    @inject(TYPES.IGetCandidateApplicationUC)
    private findApplicationUseCase: IGetCandidateApplication
  ) {}

  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      // const { jobId, resumeUrl } = req.body;
      const candidateId = req.user?.userId;
      if (!candidateId)
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          'User Id missing, UNAUTHORIZED'
        );

      const dto = ApplyJobSchema.parse({
        ...req.body,
        candidateId,
      });
      const application = await this.applyJobUseCase.execute(dto);
      console.log('application=>\n', application.toJSON());

      // res.status(StatusCode.OK).json({
      //     success:true,
      //     data:application.toJSON(),
      // })
      return ResponseHelper.success(res, StatusCode.OK, {
        data: application.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId)
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          'User Id missing, UNAUTHORIZED'
        );

      const applications = await this.getAllApplicationsUseCase.execute({
        candidateId,
      });

      return ResponseHelper.success(res, StatusCode.OK, {
        data: applications.map((app) => app.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationById(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          'User Id missing, UNAUTHORIZED'
        );
      }

      const { id: applicationId } = req.params;
      if (!applicationId || typeof applicationId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          'Invalid Application ID'
        );

        // return res.status(StatusCode.UNAUTHORIZED).json({
        //     success:false,
        //     error:"Invalid Application ID"
        // })
      }
      const dto = GetCandidateApplicationSchema.parse({
        candidateId,
        applicationId,
      });

      const result = await this.findApplicationUseCase.execute(dto); //error

      return ResponseHelper.success(res, StatusCode.OK, {
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
