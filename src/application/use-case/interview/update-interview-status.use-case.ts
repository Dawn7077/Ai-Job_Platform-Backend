import { InterviewStatusType } from '../../../domain/entities/interview.entity';
import { IInterviewRepository } from '../../../domain/repositories/i-interview.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { InterviewMessages } from '../../../shared/constants/interview-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

export interface IUpdateInterviewStatusUC {
  execute(interviewId: string, status: InterviewStatusType): Promise<void>;
}

export class UpdateInterviewStatusUC implements IUpdateInterviewStatusUC {
  constructor(private interviewRepo: IInterviewRepository) {}

  async execute(interviewId: string, status: InterviewStatusType) {
    const interview = await this.interviewRepo.findById(interviewId);
    if (!interview) {
      throw new AppError(
        InterviewMessages.ROOM_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.INVALID_ROOM_KEY
      );
    }

    await this.interviewRepo.updateStatus(interviewId, status);
  }
}
