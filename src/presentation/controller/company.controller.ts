import { NextFunction, Request, Response } from 'express';
import { ICreateJobUseCase } from '../../application/interface/use-cases/company/i-create-job.use-case';
import { z } from 'zod';
import { StatusCode } from '../../shared/constants/status-code.constant';
import { CompanyMessages } from '../../shared/constants/company-messages.constant';
import { IGetJOBCompany } from '../../application/interface/use-cases/company/i-get-company-jobs.use-case';
import { IGetAllApplications_Company } from '../../application/interface/use-cases/company/i-get-all-applications-company.use-case';
import { IGetApplication_Company } from '../../application/interface/use-cases/company/i-get-application-details.use-case';
import { IScheduleInterviewUC } from '../../application/interface/use-cases/company/i-schedule-interview.use-case';
import { IGetInterviewByRoomKeyUC } from '../../application/interface/use-cases/company/i-get-interview-by-room-key.use-case';
import { ISubmitInterviewEvaluationUC } from '../../application/interface/use-cases/company/i-submit-interview-evaluation.use-case';
import { IGetApplicationByJobIdUC } from '../../application/interface/use-cases/company/i-get-applications-by-jobId.use-case';
import { ApplicationStage } from '@prisma/client';
import { IUpdateApplicationStageUseCase } from '../../application/interface/use-cases/company/i-update-application-stage.use-case';
import { ISaveProfileCompanyUC } from '../../application/interface/use-cases/company/i-save-company-profile.use-case';
import { IGetProfileCompanyUC } from '../../application/interface/use-cases/company/i-get-company-profile.use-case';
import { IGetCompanyInterviewUC } from '../../application/interface/use-cases/company/i-get-company-interviews.use-case';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import {
  CreateJobSchema,
  UpdateJobSchema,
} from '../../application/dtos/company/create-job.dto';
import { IUpdateJobUseCase } from '../../application/use-case/company/update-job.use-case';
import { DeleteJobParamSchema } from '../../application/dtos/company/delete-job.dto';
import { IDeleteJobUseCase } from '../../application/use-case/company/delete-job.use-case';
import { GetCompanyApplicationsSchema } from '../../application/dtos/company/applications.dto';
import { ResponseHelper } from '../../shared/models/response.model';
import { ApplicationDetailsParamSchema } from '../../application/dtos/company/application-details.dto';
import {
  UpdateApplicationParamSchema,
  UpdateApplicationStageRequestSchema,
} from '../../application/dtos/company/update-application.dto';
import { ScheduleInterviewSchema } from '../../application/dtos/company/schedule-interview.dto';
import { GetInterviewByRoomKeyParamSchema } from '../../application/dtos/interview/get-by-room-key.dto';
import {
  SubmitEvaluationBodySchema,
  SubmitEvaluationParamSchema,
} from '../../application/dtos/interview/submit-evaluation.dto';
import { IGetAllCandidatesUseCase } from '../../application/interface/use-cases/company/i-get=all-candidates.use-case';
import { IGetCandidateDetailsUseCase } from '../../application/interface/use-cases/company/i-get-candidate-details.use-case';
import {
  GetCandidateDetailParamsSchema,
  GetCandidatesQuerySchema,
} from '../../application/dtos/company/get-candidate.dto';

@injectable()
export class CompanyController {
  constructor(
    @inject(TYPES.ICreateJob) private createJobUseCase: ICreateJobUseCase,
    @inject(TYPES.IUpdateJobUseCase)
    private updateJobUseCase: IUpdateJobUseCase,
    @inject(TYPES.IDeleteJobUseCase)
    private deleteJobUseCase: IDeleteJobUseCase,
    @inject(TYPES.IGetJobsUseCase) private getJobsUseCase: IGetJOBCompany,
    @inject(TYPES.IGetAllApplications_Company)
    private getAllapplicationUseCase: IGetAllApplications_Company,
    @inject(TYPES.IGetApplicationByJobIdUC)
    private getApplicationsByJobIdUC: IGetApplicationByJobIdUC,
    @inject(TYPES.IGetApplication_Company)
    private getApplicationdetailsUC: IGetApplication_Company,
    @inject(TYPES.IUpdateApplicationStageUseCase)
    private updateApplicationUseCase: IUpdateApplicationStageUseCase,
    @inject(TYPES.IScheduleInterviewUC)
    private scheduleUseCase: IScheduleInterviewUC,
    @inject(TYPES.IGetInterviewByRoomKeyUC)
    private getByRoomKeyUC: IGetInterviewByRoomKeyUC,
    @inject(TYPES.ISubmitInterviewEvaluationUC)
    private submitEvaluationUsecase: ISubmitInterviewEvaluationUC,
    @inject(TYPES.ISaveProfileCompanyUC)
    private saveProfileUseCase: ISaveProfileCompanyUC,
    @inject(TYPES.IGetProfileCompanyUC)
    private getProfileUseCase: IGetProfileCompanyUC,
    @inject(TYPES.IGetCompanyInterviewUC)
    private getCompanyInterviewUC: IGetCompanyInterviewUC,
    @inject(TYPES.IGetAllCandidatesUseCase)
    private getAllCandidatesUseCase: IGetAllCandidatesUseCase,
    @inject(TYPES.IGetCandidateDetailsUseCase)
    private getCandidateDetailsUseCase: IGetCandidateDetailsUseCase

    // private getJobsTypeUseCase:IGetJOBTypeCompany
  ) {}

  saveProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      const profileData = req.body;
      const profile = await this.saveProfileUseCase.execute(
        userId,
        profileData
      );

      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     message:"Company profile saved successfully",
      //     data:profile.toJSON()
      // })

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        { data: profile.toJSON() },
        'Company profile saved successfully'
      );
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      const profile = await this.getProfileUseCase.execute(userId);

      return ResponseHelper.success(res, StatusCode.OK, {
        data: profile.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  postJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateJobSchema.parse(req.body);
      // or
      const companyId = req.user?.userId;
      // const { companyId,companyName}
      // const companyName =req.uyse

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_NAME_ID
        );
      }

      const job = await this.createJobUseCase.execute(companyId, validatedData);

      return ResponseHelper.success(res, StatusCode.CREATED, {
        data: job.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  getJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.user?.userId;
      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          CompanyMessages.UNAUTHORIZED
        );
      }

      const data = await this.getJobsUseCase.execute(companyId);

      return ResponseHelper.success(res, StatusCode.OK, {
        data: data.jobList,
      });
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = req.params.jobId;
      const validatedData = UpdateJobSchema.parse(req.body);
      const companyId = req.user?.userId;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_NAME_ID
        );
      }
      if (!jobId || typeof jobId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_JOB_ID
        );
      }

      const job = await this.updateJobUseCase.execute(
        jobId,
        companyId,
        validatedData
      );

      return ResponseHelper.success(res, StatusCode.CREATED, {
        data: job.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = DeleteJobParamSchema.parse(req.params);
      const companyId = req.user?.userId;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_NAME_ID
        );
      }
      if (!jobId || typeof jobId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_JOB_ID
        );
      }

      await this.deleteJobUseCase.execute(jobId, companyId);

      return ResponseHelper.success(
        res,
        StatusCode.CREATED,
        CompanyMessages.SUCCESSFUL_JOB_DELETE
      );
    } catch (error) {
      next(error);
    }
  };

  getAllApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;
      const dto = GetCompanyApplicationsSchema.parse({ companyId });
      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          CompanyMessages.UNAUTHORIZED
        );
      }
      const applications = await this.getAllapplicationUseCase.execute(dto);
      const results = applications.map((app) => app.toJSON());

      return ResponseHelper.success(res, StatusCode.OK, {
        applications: results,
      });
    } catch (error) {
      next(error);
    }
  };

  getApplicationByJobId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;
      const { jobId } = req.params;
      const { status } = req.body;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          CompanyMessages.UNAUTHORIZED
        );
      }
      if (!jobId || typeof jobId !== 'string')
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.INVALID_JOB_ID
        );

      const applications = await this.getApplicationsByJobIdUC.execute(
        companyId,
        jobId,
        status
      );

      return ResponseHelper.success(res, StatusCode.OK, {
        applications,
      });
    } catch (error) {
      next(error);
    }
  };

  // specific application by id jobid and companyid
  getApplicationById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;
      const dto = ApplicationDetailsParamSchema.parse(req.params);
      const { jobId, id: applicationId } = dto;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          CompanyMessages.UNAUTHORIZED
        );
      }
      if (!applicationId || typeof applicationId !== 'string')
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.INVALID_APPLICATION_ID
        );

      if (!jobId || typeof jobId !== 'string')
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.INVALID_JOB_ID
        );

      const application = await this.getApplicationdetailsUC.execute(
        companyId,
        dto
      );

      return ResponseHelper.success(res, StatusCode.OK, {
        application: application.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  updateApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          'User Id missing, UNAUTHORIZED'
        );
      }

      const applicationDTO = UpdateApplicationParamSchema.parse(req.params);
      const stageDTO = UpdateApplicationStageRequestSchema.parse(req.body);

      const { id: applicationId } = applicationDTO;
      const { stage } = stageDTO;

      if (!applicationId || typeof applicationId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.INVALID_APPLICATION_ID
        );
      }
      //     return res.status(StatusCode.UNAUTHORIZED).json({
      //     success:false,
      //     error:"Invalid Application ID"
      // })

      if (!stage || !Object.values(ApplicationStage).includes(stage)) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'Invalid application stage provided'
        );
      }

      const updatedApplication = await this.updateApplicationUseCase.execute(
        companyId,
        applicationDTO,
        stageDTO
      );

      return ResponseHelper.success(res, StatusCode.OK, {
        data: updatedApplication.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  scheduleInterview = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;

      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.UNAUTHORIZED,
          CompanyMessages.UNAUTHORIZED
        );
      }
      const dto = ScheduleInterviewSchema.parse(req.body);
      // const {applicationId,candidateId,scheduledAt} = dto

      const result = await this.scheduleUseCase.execute({ ...dto, companyId });
      const data = {
        interview: result.interview.toJSON(),
        application: result.application.toJSON(),
      };
      return ResponseHelper.success(res, StatusCode.OK, { data });
    } catch (error) {
      next(error);
    }
  };

  getInterviewByRoomKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { roomKey } = GetInterviewByRoomKeyParamSchema.parse(req.params);
      if (!roomKey || typeof roomKey !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'Invalid roomKey provided'
        );
      }
      // return res.status(StatusCode.BAD_REQUEST).json({
      //     success:false,
      //     error:"Invalid roomKey provided"
      // })
      const result = await this.getByRoomKeyUC.execute({ roomKey });

      return ResponseHelper.success(res, StatusCode.OK, {
        interview: result.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  submitEvaluation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { interviewId } = SubmitEvaluationParamSchema.parse(req.params);
      const dto = SubmitEvaluationBodySchema.parse(req.body);

      if (!interviewId || typeof interviewId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'Invalid interview ID'
        );
      }

      //     return res.status(StatusCode.BAD_REQUEST).json({
      //     success:false,
      //     error:"Invalid interview ID"
      // })

      const result = await this.submitEvaluationUsecase.execute({
        interviewId,
        ...dto,
      });

      return ResponseHelper.success(res, StatusCode.OK, {
        data: result.toJSON(),
      });
      // res.status(StatusCode.OK).json({
      //     success:true,
      //     data:result.toJSON()
      // })
    } catch (error) {
      next(error);
    }
  };

  getAllInterviews = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;
      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_ID
        );
      }
      const interviews = await this.getCompanyInterviewUC.execute(companyId);

      return ResponseHelper.success(res, StatusCode.OK, {
        interviews,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllCandidates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log('get canidates hit=>');
      const companyId = req.user?.userId;
      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_ID
        );
      }
      const dto = GetCandidatesQuerySchema.parse(req.query);

      const results = await this.getAllCandidatesUseCase.execute(dto);

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        {
          data: {
            candidates: results.candidates,
            total: results.total,
            page: results.page,
            totalPages: results.totalPages,
          },
        },
        'Candidates fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  };
  getCandidateDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const companyId = req.user?.userId;
      if (!companyId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          CompanyMessages.MISSING_ID
        );
      }
      const { candidateId } = GetCandidateDetailParamsSchema.parse(req.params);

      const results =
        await this.getCandidateDetailsUseCase.execute(candidateId);

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        {
          data: results,
        },
        'Candidates fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  };
}
