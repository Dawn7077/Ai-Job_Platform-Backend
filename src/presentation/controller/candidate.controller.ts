import { NextFunction, Request, Response } from 'express';
// import { IClassfierIntent } from "../../application/agent/Models/Classifier";
import { StatusCode } from '../../shared/constants/status-code.constant';
import { MentorChatUseCase } from '../../application/use-case/candidate/mentor-chat.use-case';
import { IGETActiveJobs } from '../../application/interface/use-cases/candidate/i-get-active-jobs.use-case';
import { IGetActiveJobById } from '../../application/interface/use-cases/candidate/i-get-jobs-by-id.use-case';
import { ISaveCandidateProfile } from '../../application/interface/use-cases/candidate/i-save-candidate-profile.use-case';
import { IGetProfileCandidateUseCase } from '../../application/interface/use-cases/candidate/i-get-profile-candidate.use-case';
import { IGetResumeUrlUseCase } from '../../application/interface/use-cases/candidate/i-get-resume-url.use-case';
import { IProcessResumeUseCase } from '../../application/interface/use-cases/candidate/i-process-resume.use-case';
import { IGetUploadResumeUrlUseCase } from '../../application/interface/use-cases/candidate/i-get-upload-resume-url.use-case';
import { IGetCandidateInterviewUC } from '../../application/interface/use-cases/candidate/i-get-candidate-interview.use-case';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import {
  MentorChatRequestDTO,
  MentorChatSchema,
} from '../../application/dtos/candidate/mentor-chat.dto';
import {
  GetActiveJobRequestDTO,
  GetActiveJobSchema,
} from '../../application/dtos/candidate/get-active-job-id.dto';
import { SaveCandidateProfileSchema } from '../../application/dtos/candidate/save-profile.dto';
import { GetProfileCandidateSchema } from '../../application/dtos/candidate/get-profile-candidate.dto';
import { GetUploadResumeURLSchema } from '../../application/dtos/candidate/get-upload-resume-url.dto';
import { GetResumeUrlSchema } from '../../application/dtos/candidate/get-resume-url.dto';
import { ResponseHelper } from '../../shared/models/response.model';
import { IStartMockInterviewUseCase } from '../../application/interface/use-cases/candidate/i-start-mock-interview-use-case';
import { ISubmitMockInterviewMessageUseCase } from '../../application/interface/use-cases/candidate/i-submit-mock-interview-message-use-case';
import { ICompleteMockInterviewUseCase } from '../../application/interface/use-cases/candidate/i-complete-mock-interview-use-case';
import {
  CompleteMockInterviewSchema,
  CreateMockInterviewSchema,
  GetMockInterviewSessionsSchema,
  SubmitMockInterviewMessagesSchema,
} from '../../application/dtos/candidate/start-mock-interview.dto';
import { IGetAllMockInterviewSessionsUseCase } from '../../application/interface/use-cases/candidate/i-get-all-mock-sessions.use-case';

@injectable()
export class CandidateController {
  constructor(
    @inject(TYPES.IMentorChatUseCase)
    private mentorChatUseCase: MentorChatUseCase,
    @inject(TYPES.IGetActiveJobsUseCase)
    private getAllJobsUseCase: IGETActiveJobs,
    @inject(TYPES.IGetActiveJobById)
    private getJobDetailsUseCase: IGetActiveJobById,
    @inject(TYPES.ISaveCandidateProfile)
    private saveProfileUseCase: ISaveCandidateProfile,
    @inject(TYPES.IGetProfileCanidateUseCase)
    private getProfileUseCase: IGetProfileCandidateUseCase,
    @inject(TYPES.IGetUploadResumeUrlUseCase)
    private getUploadResumeUrlUseCase: IGetUploadResumeUrlUseCase,
    @inject(TYPES.IProcessResumeUseCase)
    private processResumeUseCase: IProcessResumeUseCase,
    @inject(TYPES.IGetResumeUrlUseCase)
    private getReadResumeUrlUseCase: IGetResumeUrlUseCase,
    @inject(TYPES.IGetCandidateInterviewUC)
    private getCandidateInterviewUseCase: IGetCandidateInterviewUC,
    @inject(TYPES.IStartMockInterviewUseCase)
    private startMockInterviewUseCase: IStartMockInterviewUseCase,
    @inject(TYPES.ISubmitMockInterviewMessageUseCase)
    private submitMockInterviewUseCase: ISubmitMockInterviewMessageUseCase,
    @inject(TYPES.ICompleteMockInterviewUseCase)
    private completeMockInterviewUseCase: ICompleteMockInterviewUseCase,
    @inject(TYPES.IGetAllMockInterviewSessionsUseCase)
    private getAllMockInterviewSessionsUseCase: IGetAllMockInterviewSessionsUseCase
  ) {}

  async sendMentorMessage(req: Request, res: Response, next: NextFunction) {
    console.log('req was hit:', req.body.message);
    try {
      const dto: MentorChatRequestDTO = MentorChatSchema.parse(req.body);
      const { userId, message } = dto;
      if (!userId || !message) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'UserId and message prompt are required'
        );
      }

      const response = await this.mentorChatUseCase.execute(dto);
      console.log(response);

      return ResponseHelper.success(res, StatusCode.OK, {
        data: response,
      });
      // res.status(StatusCode.OK).json({
      //     success:true,
      //     data:response
      // })
    } catch (error) {
      next(error);
    }
  }

  async getActiveJobs(_: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await this.getAllJobsUseCase.execute();

      return ResponseHelper.success(res, StatusCode.OK, {
        data: jobs,
      });
      // res.status(StatusCode.OK).json({
      //     success:true,
      //     data:jobs
      // })
    } catch (error) {
      next(error);
    }
  }
  async getJobDetailsById(req: Request, res: Response, next: NextFunction) {
    try {
      // const {id:jobId} = req.params
      const dto: GetActiveJobRequestDTO = GetActiveJobSchema.parse({
        jobId: req.params.id,
      });
      const { jobId } = dto;
      if (!jobId || typeof jobId !== 'string') {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'JobId is required'
        );
      }
      const jobData = await this.getJobDetailsUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        data:
          typeof jobData.toJSON() === 'function' ? jobData.toJSON() : jobData,
      });
      // res.status(StatusCode.OK).json({
      //     success:true,
      //     data:typeof jobData.toJSON()==='function'? jobData.toJSON():jobData
      // })
    } catch (error) {
      next(error);
    }
  }

  async saveProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // const userId = req.user?.userId
      const dto = SaveCandidateProfileSchema.parse({
        userId: req.user?.userId,
        profileData: req.body,
      });
      if (!dto.userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      // const profileData = req.body
      const profile = await this.saveProfileUseCase.execute(dto);

      return ResponseHelper.success(
        res,
        StatusCode.OK,
        {
          data: profile.toJSON(),
        },
        'Profile saved successfully'
      );
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     message:"Profile saved successfully",
      //     data: profile.toJSON()
      // })
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetProfileCandidateSchema.parse({ userId: req.user?.userId });
      const { userId } = dto;

      if (!userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }

      const profile = await this.getProfileUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        data: profile.toJSON(),
      });
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     data: profile.toJSON()
      // })
    } catch (error) {
      next(error);
    }
  }

  async getResumeUploadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetUploadResumeURLSchema.parse(req.body);
      const { fileName, mimeType } = dto;
      if (!fileName || !mimeType) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'fileName and mimeType are required'
        );
      }
      const result = await this.getUploadResumeUrlUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        result,
      });
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     result
      // })
    } catch (error) {
      next(error);
    }
  }

  async processResume(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const { fileKey } = req.body;
      if (!userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      if (!fileKey) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'fileKey is required'
        );
      }

      const result = await this.processResumeUseCase.execute(userId, fileKey);

      return ResponseHelper.success(res, StatusCode.OK, {
        result,
      });
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     result
      // })
    } catch (error) {
      next(error);
    }
  }
  async getResumeUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetResumeUrlSchema.parse({ userId: req.user?.userId });
      if (!dto.userId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      const url = await this.getReadResumeUrlUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        resumeUrl: url,
      });
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     resumeUrl:url
      // })
    } catch (error) {
      next(error);
    }
  }

  async getAllInterviews(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      if (!candidateId) {
        return ResponseHelper.error(
          res,
          StatusCode.BAD_REQUEST,
          'User Id is required'
        );
      }
      const interviews =
        await this.getCandidateInterviewUseCase.execute(candidateId);

      return ResponseHelper.success(res, StatusCode.OK, {
        interviews,
      });
      // return res.status(StatusCode.OK).json({
      //     success:true,
      //     interviews
      // })
    } catch (error) {
      next(error);
    }
  }

  // mock interview controllers
  async startMockInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      const dto = CreateMockInterviewSchema.parse({
        candidateId,
        ...req.body,
      });
      console.log('startmock', dto);

      const result = await this.startMockInterviewUseCase.execute(dto);
      //       const result: {
      //        session: MockInterview;
      //        message: string;
      //       }

      return ResponseHelper.success(res, StatusCode.OK, {
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMockInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      const dto = SubmitMockInterviewMessagesSchema.parse({
        candidateId,
        ...req.body,
      });
      console.log('updatemock', dto);

      const result = await this.submitMockInterviewUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async completeMockInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      const sessionId = req.params.id;
      const dto = CompleteMockInterviewSchema.parse({
        candidateId,
        // ...req.body,
        sessionId,
      });

      const result = await this.completeMockInterviewUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  }
  async getAllMockInterviews(req: Request, res: Response, next: NextFunction) {
    try {
      const candidateId = req.user?.userId;
      const dto = GetMockInterviewSessionsSchema.parse({
        candidateId,
      });

      const sessions =
        await this.getAllMockInterviewSessionsUseCase.execute(dto);

      return ResponseHelper.success(res, StatusCode.OK, {
        sessions,
      });
    } catch (error) {
      next(error);
    }
  }

  async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('runCode Hit');
      const { language, sourceCode } = req.body;

      // Map languages to Piston's expected format and versions
      const languageMap: Record<string, { language: string; version: string }> =
        {
          javascript: { language: 'javascript', version: '18.15.0' },
          python: { language: 'python', version: '3.10.0' },
          java: { language: 'java', version: '15.0.2' },
          cpp: { language: 'cpp', version: '10.2.0' },
        };

      const langConfig = languageMap[language] || languageMap['javascript'];

      // Send request to your local Piston Docker container using native fetch
      const pistonResponse = await fetch(
        'http://localhost:2000/api/v2/execute',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: langConfig.language,
            version: langConfig.version,
            files: [{ content: sourceCode }],
          }),
        }
      );

      const data = await pistonResponse.json();
      console.log(`runCode result => ${data}`);

      if (!pistonResponse.ok) {
        return res.status(pistonResponse.status).json(data);
      }

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
