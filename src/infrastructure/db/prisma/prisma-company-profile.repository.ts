import { PrismaClient } from '@prisma/client';
import { ICompanyProfileRepo } from '../../../domain/repositories/i-company-profile.repository';
import {
  CompanyProfile,
  CompanyProfileProps,
} from '../../../domain/entities/company-profile.entity';
import { CompanyProfileMapper } from '../mappers/company-profile.mapper';
import { inject, injectable } from 'inversify';
import { BaseRepository } from './base.repository';
import { TYPES } from '../../../di/types';

@injectable()
export class PrismaCompanyProfileRepo
  extends BaseRepository
  implements ICompanyProfileRepo
{
  constructor(
    @inject(TYPES.PrismaClient) protected readonly prisma: PrismaClient
  ) {
    super(prisma);
  }

  async findbyUserId(userId: string): Promise<CompanyProfile | null> {
    const raw = await this.prisma.companyProfile.findUnique({
      where: { userId },
    });
    if (!raw) return null;

    return CompanyProfileMapper.toDomain(raw);
  }

  async upsertProfile(
    userId: string,
    data: Partial<CompanyProfileProps>
  ): Promise<CompanyProfile> {
    const raw = await this.prisma.companyProfile.upsert({
      where: { userId },
      update: {
        companyName: data.companyName,
        industry: data.industry,
        companySize: data.companySize,
        website: data.website,
        location: data.location,
        logoUrl: data.logoUrl,
        description: data.description,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      create: {
        userId,
        companyName: data.companyName || '',
        industry: data.industry,
        companySize: data.companySize,
        website: data.website,
        location: data.location,
        description: data.description,
        logoUrl: data.logoUrl,
      },
    });

    return CompanyProfileMapper.toDomain(raw);
  }
}
