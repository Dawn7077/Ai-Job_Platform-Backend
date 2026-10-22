import { z } from 'zod';

export const ExperienceItemSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

export const EducationItemSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution name is required'),
  startYear: z.string().min(1, 'Start Year is required'),
  endYear: z.string().min(1, 'End Year is required'),
});

export const SaveCandidateProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  profileData: z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'First Name is required'),
    phone: z.string().optional(),
    headline: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    websiteUrl: z.string().url('Invalid website URL').optional(),
    githubUrl: z.string().url('Invalid website URL').optional(),
    linkedinUrl: z.string().url('Invalid website URL').optional(),
    skills: z.array(z.string()).optional(),
    resumeKey: z.string().optional(),
    experience: z.array(ExperienceItemSchema).optional(),
    education: z.array(EducationItemSchema).optional(),
  }),
});

export type SaveCandidateProfileRequestDTO = z.infer<
  typeof SaveCandidateProfileSchema
>;
