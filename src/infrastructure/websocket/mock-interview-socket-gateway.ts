import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../../shared/utils/loggers.util';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { ISubmitMockInterviewMessageUseCase } from '../../application/interface/use-cases/candidate/i-submit-mock-interview-message-use-case';
import { ICompleteMockInterviewUseCase } from '../../application/interface/use-cases/candidate/i-complete-mock-interview-use-case';
import {
  CompleteMockInterviewSchema,
  SubmitMockInterviewMessagesSchema,
} from '../../application/dtos/candidate/start-mock-interview.dto';

@injectable()
export class MockInterviewSocketGateway {
  constructor(
    @inject(TYPES.ISubmitMockInterviewMessageUseCase)
    private processMockInterviewMessageUseCase: ISubmitMockInterviewMessageUseCase,
    @inject(TYPES.ICompleteMockInterviewUseCase)
    private completeMockInterviewUseCase: ICompleteMockInterviewUseCase
  ) {}

  public registerHandler(io: SocketIOServer) {
    io.on('connection', (socket: Socket) => {
      logger.info(`[MockInterview Socket] Candidate connected: ${socket.id}`);

      socket.on('join_room', (data: { sessionId: string }) => {
        socket.join(data.sessionId);
        logger.info(
          `[Socket] Client ${socket.id} joined room ${data.sessionId}`
        );
      });

      socket.on(
        'candidate_turn',
        async (data: {
          sessionId: string;
          candidateId: string;
          responseText: string;
        }) => {
          try {
            socket.emit('ai_thinking', { status: true });
            const dto = SubmitMockInterviewMessagesSchema.parse(data);
            console.log('socketupdatemock', dto);

            const result =
              await this.processMockInterviewMessageUseCase.execute({
                sessionId: dto.sessionId,
                candidateId: dto.candidateId,
                responseText: dto.responseText,
              });

            socket.emit('interviewer_turn', {
              sessionId: data.sessionId,
              interviewerReply: result.interviewReply,
              session: result.session,
            });
          } catch (error) {
            const errMsg =
              error instanceof Error
                ? error.message
                : 'Error on processing interview turn';
            socket.emit('error', {
              message: errMsg,
            });
          } finally {
            socket.emit('ai_thinking', { status: false });
          }
        }
      );

      socket.on(
        'complete_session',
        async (data: { sessionId: string; candidateId: string }) => {
          try {
            socket.emit('evaluating', { status: true });
            const dto = CompleteMockInterviewSchema.parse(data);

            const result = await this.completeMockInterviewUseCase.execute(dto);

            socket.emit('session_completed', {
              sessionId: dto.sessionId,
              feedback: result.feedback,
              session: result,
            });
          } catch (error) {
            const errMsg =
              error instanceof Error
                ? error.message
                : 'Error on generating evaluation feedback.';
            socket.emit('error', {
              message: errMsg,
            });
          }
        }
      );

      socket.on('disconnect', () => {
        logger.warn(
          `[MockInterview Socket] Candidate Disconnected: ${socket.id}`
        );
      });
    });
  }
}
