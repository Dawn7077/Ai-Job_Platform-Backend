import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { RedisService } from '../../infrastructure/services/redis.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../shared/constants/status-code.constant';
import { ResponseHelper } from '../../shared/models/response.model';
import { logger } from '../../shared/utils/loggers.util';

@injectable()
export class RateLimiterMiddleware {
  constructor(@inject(TYPES.RedisClient) private redisService: RedisService) {}

  public handle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const minKey = `rate_limit:min:${userId}`;
      const dayKey = `rate_limit:day:${userId}`;

      const minRequest = await this.redisService.incrementWithExpiry(
        minKey,
        60
      ); //5 req /min

      if (minRequest > 5) {
        return ResponseHelper.error(
          res,
          StatusCode.TOO_MANY_REQUEST,
          'Per Min Rate limit Ai usage exceeded: Too many request. Please slow down.'
        );
      }

      const dayRequest = await this.redisService.incrementWithExpiry(
        dayKey,
        86400
      );
      if (dayRequest > 100) {
        return ResponseHelper.error(
          res,
          StatusCode.TOO_MANY_REQUEST,
          'Daily Ai usage limit reached. Please try again tomorrow'
        );
      }
      next();
    } catch (error) {
      logger.error(
        {
          event: 'Rate limit reached',
          error:
            error instanceof Error
              ? error.message
              : 'Error due to rate limit hit',
        },
        'Rate limiter error'
      );
      next();
    }
  };
}
