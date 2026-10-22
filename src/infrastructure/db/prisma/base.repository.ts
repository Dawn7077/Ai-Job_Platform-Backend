import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';
// import { TYPES } from '../../../di/TYPES';

@injectable()
export class BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {}
}
