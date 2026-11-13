import { Application } from '../../../../domain/entities/application.entity';
import { Interview } from '../../../../domain/entities/interview.entity';
import { ScheduleInterviewPayloadDTO } from '../../../dtos/company/schedule-interview.dto';

export interface IScheduleInterviewUC {
  execute(payload: ScheduleInterviewPayloadDTO): Promise<{
    interview: Interview;
    application: Application;
  }>;
}
