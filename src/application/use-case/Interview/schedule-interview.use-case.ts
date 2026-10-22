import { inject, injectable } from 'inversify';
import {
  Application,
  ApplicationStage,
} from '../../../domain/entities/application.entity';
import { Interview } from '../../../domain/entities/interview.entity';
import { IApplicationRepository } from '../../../domain/repositories/i-application.repository';
import { IInterviewRepository } from '../../../domain/repositories/i-interview.repository';
import { IScheduleInterviewUC } from '../../interface/use-cases/company/i-schedule-interview.use-case';
import { TYPES } from '../../../di/types';
import { ScheduleInterviewPayloadDTO } from '../../dtos/company/schedule-interview.dto';

@injectable()
export class ScheduleInterviewUC implements IScheduleInterviewUC {
  constructor(
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepository,
    @inject(TYPES.IApplicationRepo)
    private applicationRepo: IApplicationRepository
  ) {}
  async execute(payload: ScheduleInterviewPayloadDTO) {
    const interview = new Interview({
      applicationId: payload.applicationId,
      candidateId: payload.candidateId,
      companyId: payload.companyId,
      scheduledAt: payload.scheduledAt,
    });
    const savedInterview = await this.interviewRepo.create(interview);

    const updatedApplication = await this.applicationRepo.updateApplication(
      payload.applicationId,
      ApplicationStage.INTERVIEW
    );

    return {
      interview: savedInterview,
      application: updatedApplication,
    };
  }
}
