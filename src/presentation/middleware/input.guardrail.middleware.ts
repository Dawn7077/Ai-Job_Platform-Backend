import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from '../../shared/utils/app-errors.util';
import { StatusCode } from '../../shared/constants/status-code.constant';

export const inputGuardrail: RequestHandler = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== 'string') {
      return next(
        new AppError(
          'Message body is required and must be a string',
          StatusCode.BAD_REQUEST,
          'INVALID_REQUEST'
        )
      );
    }

    const lowerMessage = message.toLowerCase();

    const injectionPatterns = [
      'ignore previous instructions',
      'system prompt',
      'you are now',
      'disregard all prior',
      '<|im_start|>',
      'override behaviour',
      'reveal your instructions',
    ];

    const isSuspicious = injectionPatterns.some((pattern) =>
      lowerMessage.includes(pattern)
    );

    if (isSuspicious) {
      return next(
        new AppError(
          'Request blocked by security gaurdrails: Potential prompt injection detected',
          StatusCode.FORBIDDEN,
          'PROMPT_INJECTION_DETECTED'
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
