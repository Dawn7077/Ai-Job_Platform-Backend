import {
  CandidateProfileProps,
  EducationItem,
  ExperienceItem,
} from '../../../../domain/entities/candidate-profile.entity';

export interface IGetCandidateDetailsUseCase {
  execute(userId: string): Promise<{
    email: string | undefined;
    id?: string | undefined;
    userId: string;
    firstName: string;
    lastName: string;
    phone?: string | undefined;
    headline?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    websiteUrl?: string | undefined;
    githubUrl?: string | undefined;
    linkedinUrl?: string | undefined;
    skills?: string[] | undefined;
    resumeKey?: string | undefined;
    experience?: ExperienceItem[] | undefined;
    education?: EducationItem[];
    createdAt: Date;
    updatedAt: Date;
  }>;
}
