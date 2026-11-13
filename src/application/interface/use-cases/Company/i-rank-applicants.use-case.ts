import { ApplicationStage } from '@prisma/client';
import {
  EducationItem,
  ExperienceItem,
} from '../../../../domain/entities/candidate-profile.entity';
import { RankApplicantsDTO } from '../../../dtos/company/rank-applicants.dto';
import { JobProps } from '../../../../domain/entities/job.entity';

export interface ScoredApplicantResponse {
  applicationId: string;
  candidateId: string;
  stage: ApplicationStage;
  appliedAt: Date;
  matchedScore: number;
  profileData: {
    firstName: string;
    lastName: string;
    headline: string | undefined;
    skills: string[] | undefined;
    experience: ExperienceItem[] | undefined;
    education: EducationItem[] | undefined;
  } | null;
}

export interface RankApplicantsResponseDTO {
  jobData: JobProps;
  applicants: ScoredApplicantResponse[];
}

export interface IRankApplicantsUseCase {
  execute(dto: RankApplicantsDTO): Promise<RankApplicantsResponseDTO>;
}
