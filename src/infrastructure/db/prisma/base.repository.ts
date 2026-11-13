import { PrismaClient } from '@prisma/client';
import { injectable } from 'inversify';

@injectable()
export class BaseRepository {
  constructor(protected readonly prisma: PrismaClient) {}
}
