export const CandidateMessages = {
  USER_ID_AND_PROMPT_REQUIRED: 'UserId and message prompt are required',
  JOB_ID_REQUIRED: 'JobId is required',
  USER_ID_REQUIRED: 'User Id is required',
  PROFILE_SAVED_SUCCESS: 'Profile saved successfully',
  FILENAME_AND_MIMETYPE_REQUIRED: 'fileName and mimeType are required',
  FILE_KEY_REQUIRED: 'fileKey is required',
  FIRSTNAME_LASTNAME_REQUIRED: 'FirstName and Lastname are required',
  PROFILE_NOT_FOUND:
    'This profile does not exist for this userId. Profile not found.',
  JOB_NOT_FOUND: 'This Job does not exist.',
  INVALID_FILE_TYPE:
    'Invalid file type. Only PDF and DOC/DOCX file are supported.',
  RESUME_NOT_FOUND: 'Profile not found or resume not uploaded to this profile',
  INVALID_JOB: 'Invalid Job',
  JOB_CLOSED: 'This Job is no longer accepting applications',
  JOB_CLOSED_OR_NOT_FOUND:
    'This Job posting dose not exist or is no longer active.',
  APPLICATION_EXISTS: 'You have already applied to this Job',
  APPLICATION_NOT_FOUND: 'Application dosent exit',
  MOCK_INTERVIEW_SESSION_NOT_FOUND: 'Mock Interview session not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  UNAUTHORIZED_ACCESS_TO_APPLICATION: 'Unauthorized access to this application',
  UNAUTHORIZED_ACCESS_TO_INTERVIEW_SESSION:
    'Unauthorized access to interview session',
  NO_SESSIONS_FOUND: 'No sessions were found for this user id',
  NO_PROFILE_OR_RESUME_KEY:
    'Not found Profile or resume uploaded to this profile',
  SESSION_CLOSED:
    'Cannot respond to a complete or cancelled interview session.',
} as const;

export type CandidateMessageKey = keyof typeof CandidateMessages;
