import { PrismaClient } from '@prisma/client';
import {
  CandidateFilterQueryParams,
  CandidateWithUserResult,
  ICandidateProfileRepository,
  PaginatedCandidateProfiles,
} from '../../../domain/repositories/i-candidate-profile.repository';
import {
  CandidateProfile,
  CandidateProfileProps,
} from '../../../domain/entities/candidate-profile.entity';
import { inject, injectable } from 'inversify';
import { CandidateProfileMapper } from '../mappers/candidate-profile.mapper';
import { BaseRepository } from './base.repository';
import { TYPES } from '../../../di/types';
import { UserMapper } from '../mappers/user.mapper';

@injectable()
export class PrismaCandidateProfileRepo
  extends BaseRepository
  implements ICandidateProfileRepository
{
  constructor(
    @inject(TYPES.PrismaClient) protected readonly prisma: PrismaClient
  ) {
    super(prisma);
  }

  async findByUserId(userId: string): Promise<CandidateProfile | null> {
    const raw = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!raw) return null;

    return CandidateProfileMapper.toDomain(raw);
  }

  async findCandidates(
    params: CandidateFilterQueryParams
  ): Promise<PaginatedCandidateProfiles> {
    const { page, limit, search, location } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
      ];
    }

    if (location) {
      where.location = { contains: location };
    }

    const [rawProfiles, total] = await Promise.all([
      this.prisma.candidateProfile.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.candidateProfile.count({ where }),
    ]);

    const candidates: CandidateWithUserResult[] = rawProfiles.map((raw) => ({
      profile: CandidateProfileMapper.toDomain(raw),
      email: raw.user.email,
    }));

    return {
      candidates,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async upsertProfile(
    userId: string,
    data: Partial<CandidateProfileProps>
  ): Promise<CandidateProfile> {
    const raw = await this.prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        webSiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills,
        resumeKey: data.resumeKey,
        experience: (data.experience as any) ?? [],
        education: (data.education as any) ?? [],
      },
      create: {
        userId,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone,
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        webSiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        skills: data.skills,
        resumeKey: data.resumeKey,
        experience: data.experience as any,
        education: data.education as any,
      },
    });

    return CandidateProfileMapper.toDomain(raw);
  }

  async updateResumeKey(
    userId: string,
    resumeKey: string
  ): Promise<CandidateProfile> {
    const raw = await this.prisma.candidateProfile.update({
      where: { userId },
      data: { resumeKey },
    });

    return CandidateProfileMapper.toDomain(raw);
  }
}
