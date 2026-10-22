import { Interview } from '../../../domain/entities/interview.entity';
import { IInterviewRepository } from '../../../domain/repositories/i-interview.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { InterviewMessages } from '../../../shared/constants/interview-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

export interface IGetInterviewByIDUseCase {
  execute(id: string): Promise<Interview>;
}
export class GetInterviewByIDUseCase implements IGetInterviewByIDUseCase {
  constructor(private interviewRepo: IInterviewRepository) {}

  async execute(id: string) {
    const interview = await this.interviewRepo.findById(id);
    if (!interview) {
      throw new AppError(
        InterviewMessages.NO_INTERVIEW_FOUND_WITH_THIS_INTERVIEW_ID,
        StatusCode.NOT_FOUND,
        ErrorCode.INVALID_ID
      );
    }
    return interview;
  }
}
