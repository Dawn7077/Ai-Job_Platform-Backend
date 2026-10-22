import { inject, injectable } from 'inversify';
import { Interview } from '../../../domain/entities/interview.entity';
import { IInterviewRepository } from '../../../domain/repositories/i-interview.repository';
import { AppError } from '../../../shared/utils/app-errors.util';
import { StatusCode } from '../../../shared/constants/status-code.constant';
import { IGetInterviewByRoomKeyUC } from '../../interface/use-cases/company/i-get-interview-by-room-key.use-case';
import { TYPES } from '../../../di/types';
import { GetInterviewByRoomKeyParamDTO } from '../../dtos/interview/get-by-room-key.dto';
import { InterviewMessages } from '../../../shared/constants/interview-messages.constant';
import { ErrorCode } from '../../../shared/constants/general-constants';

@injectable()
export class GetInterviewByRoomKeyUC implements IGetInterviewByRoomKeyUC {
  constructor(
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepository
  ) {}

  async execute(dto: GetInterviewByRoomKeyParamDTO) {
    const { roomKey } = dto;
    const interview = await this.interviewRepo.findByRoomKey(roomKey);
    if (!interview) {
      throw new AppError(
        InterviewMessages.ROOM_NOT_FOUND,
        StatusCode.NOT_FOUND,
        ErrorCode.INVALID_ROOM_KEY
      );
    }
    return interview;
  }
}
