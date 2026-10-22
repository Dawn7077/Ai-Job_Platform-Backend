import { z } from 'zod';

const MockInterviewTypeEnum = z.enum([
  'BEHAVIOUR',
  'TECHNICAL',
  'SYSTEM_DESIGN',
]);
const MockInterviewStatusEnum = z.enum([
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);
//start mock
export const CreateMockInterviewSchema = z.object({
  candidateId: z.string().min(1, 'candidate Id is required'),
  jobId: z.string().optional(),
  targetRole: z.string().min(1, 'targetRole role is required'),
  type: MockInterviewTypeEnum.default('BEHAVIOUR'),
});

export type CreateMockInterviewDTO = z.infer<typeof CreateMockInterviewSchema>;

// updat mock
export const SubmitMockInterviewMessagesSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  candidateId: z.string().min(1, 'Candidate Id  is required'),
  responseText: z.string().min(1, 'Response text cannot be empty'),
});

export type SubmitMockInterviewMessagesDTO = z.infer<
  typeof SubmitMockInterviewMessagesSchema
>;

// Response
export const MockInterviewResponseSchema = z.object({
  id: z.string(),
  candidateId: z.string(),
  jobId: z.string().nullable(),
  type: MockInterviewTypeEnum,
  targetRole: z.string(),
  status: MockInterviewStatusEnum,
  transcript: z.array(
    z.object({
      role: z.enum(['interviewer', 'candidate']),
      text: z.string(),
      timestamp: z.date(),
    })
  ),
  feedback: z
    .object({
      overallScore: z.number(),
      communicationScore: z.number(),
      technicalScore: z.number(),
      strengths: z.array(z.string()),
      improvements: z.array(z.string()),
      summary: z.string(),
    })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export type MockInterviewResponseDTO = z.infer<
  typeof MockInterviewResponseSchema
>;

//complete usecase
export const CompleteMockInterviewSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  candidateId: z.string().min(1, 'Candidate Id  is required'),
});

export type CompleteMockInterviewResponseDTO = z.infer<
  typeof CompleteMockInterviewSchema
>;

// get sessions
export const GetMockInterviewSessionsSchema = z.object({
  candidateId: z.string().min(1, 'Candidate Id  is required'),
});

export type GetMockInterviewSessionsDTO = z.infer<
  typeof GetMockInterviewSessionsSchema
>;
