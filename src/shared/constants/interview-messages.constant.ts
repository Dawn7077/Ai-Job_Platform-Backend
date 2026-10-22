export const InterviewMessages = {
  INVALID_ROOM_KEY: 'Invalid roomKey provided',
  INVALID_INTERVIEW_ID: 'Invalid interview ID, no Interview found.',
  ROOM_NOT_FOUND: 'No Interview room found with this Room key',
  NO_INTERVIEW_FOUND_WITH_THIS_INTERVIEW_ID:
    'No Interview room found with this interview id',
  INTERVIEW_NOT_FOUND: 'Interview NOT FOUND',
  MOCK_SESSION_NOT_FOUND: 'Mock Interview session not found',
  UNAUTHORIZED_MOCK_ACCESS: 'Unauthorized access to interview session',
  MOCK_SESSION_CLOSED:
    'Cannot respond to a complete or cancelled interview session.',
} as const;

export type InterviewMessageKey = keyof typeof InterviewMessages;
