import { Redis } from 'ioredis';
import { ICacheService } from '../db/redis/redis-client.db';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { AppError } from '../../shared/utils/app-errors.util';
import { StatusCode } from '../../shared/constants/status-code.constant';

@injectable()
export class RedisService implements ICacheService {
  constructor(@inject(TYPES.RedisClient) private redis_client: Redis) {}

  async set(
    key: string,
    value: string,
    expiryInSeconds?: number
  ): Promise<void> {
    if (expiryInSeconds) {
      await this.redis_client.set(key, value, 'EX', expiryInSeconds);
    } else {
      await this.redis_client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redis_client.get(key);
  }

  async del(key: string): Promise<number> {
    return await this.redis_client.del(key);
  }

  async ttl(key: string): Promise<number> {
    return await this.redis_client.ttl(key);
  }

  async incrementWithExpiry(
    key: string,
    expiryInSeconds: number
  ): Promise<number> {
    const result = await this.redis_client.multi().incr(key).ttl(key).exec();

    if (!result || !result[0] || !result[1]) {
      throw new AppError(
        'Redis transaction Error',
        StatusCode.INTERNAL_SERVER_ERROR,
        'INTERNAL_SERVER_ERROR'
      );
    }

    const [incrErr, count] = result[0];
    const [ttlErr, ttl] = result[1];

    if (incrErr) throw incrErr;
    if (ttlErr) throw incrErr;

    if (ttl === -1 || ttl === -2) {
      await this.redis_client.expire(key, expiryInSeconds);
    }

    return count as number;
  }
}
