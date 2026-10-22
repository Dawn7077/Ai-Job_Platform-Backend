export const CompanyMessages = {
  MISSING_FEILDS: 'Missing required fields!',
  USER_ID_REQUIRED: 'User Id is required',
  MISSING_NAME_ID:
    'Company profile context missing. Required company name and company-id fields!',
  COMPANY_NOT_FOUND: 'Company User dose not exits',
  COMPANY_PROFILE_NOT_FOUND: 'Company Profile dose not exist for this user Id.',
  CANDIDATE_NOT_FOUND: 'Candidate Profile not found.',
  MISSING_ID: 'Company ID is required',
  MISSING_JOB_ID: 'job Id missing',
  COMPANY_NAME_REQUIRED: 'Company Name required',
  UNAUTHORIZED: 'UNAUTHORIZED to access this operation',
  INVALID_JOB_ID: 'Invalid Job ID',
  INVALID_APPLICATION_ID: 'Invalid Application ID',
  SUCCESSFUL_JOB_DELETE: 'Job successfully deleted',
  UNAUTHORIZED_DELETE: 'Unauthorized to delete any jobs',
  UNAUTHORIZED_UPDATE_APPLICATION: 'Unauthorized to update this application.',
  JOB_NOT_FOUND: 'Did not find any jobs posting from the provided job id ',
  UNAUTHORIZED_UPDATE_JOB: 'Unauthorized to update this job.',
  APPLICATION_NOT_FOUND: 'No Application found with this application id',
  APPLICATION_NOT_BELONG_TO_JOB:
    'This Application dosent belong to this job posting.',
  INVALID_STATE_FOR_REAPPLICATION: 'Invalid account state for reapplication',
} as const;
