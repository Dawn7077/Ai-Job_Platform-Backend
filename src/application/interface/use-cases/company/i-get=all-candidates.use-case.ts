import {
  EducationItem,
  ExperienceItem,
} from '../../../../domain/entities/candidate-profile.entity';
import { CandidateFilterQueryParams } from '../../../../domain/repositories/i-candidate-profile.repository';

export interface IGetAllCandidatesUseCase {
  execute(params: CandidateFilterQueryParams): Promise<{
    total: number;
    page: number;
    totalPages: number;
    candidates: {
      email: string;
      id?: string;
      userId: string;
      firstName: string;
      lastName: string;
      phone?: string;
      headline?: string;
      bio?: string;
      location?: string;
      websiteUrl?: string;
      githubUrl?: string;
      linkedinUrl?: string;
      skills?: string[];
      resumeKey?: string;
      experience?: ExperienceItem[];
      education?: EducationItem[];
      createdAt: Date;
      updatedAt: Date;
    }[];
  }>;
}
