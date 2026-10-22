export const AdminMessages = {
  MISSING_USER_ID_STATUS:
    "UserId and valid status ('ACTIVE','SUSPENDED') are required.",
  MISSING_USER_ID: 'Valid UserId are required.',
  COMPANY_NOT_FOUND: 'Company account not Found.',
  ADMIN_NOT_FOUND: 'Admin user account not Found.',
  ADMIN_PROFILE_NOT_FOUND: 'Admin profile not Found.',
  UNAUTHORIZED_ACCESS: 'Unauthorised access of user management.',
  INVALID_ROLE: 'Target user account is not a company',
  STATUS_UPDATE: (status: string) => `Company Status updated to ${status} `,
  INVALID_STATUS: "Valid status('ACTIVE','SUSPENDED','PENDING') is required.",
  SUCCESS_DELETE: (userId: string) =>
    `Successfully deleted the user account with user ID:${userId} `,
  CANNOT_MODIFY_OWN_ACCOUNT: 'You cannot modify your own active admin account',
  USER_STATUS_UPDATED: 'User status updated successfully',
  USER_ROLE_UPDATED: 'User role updated successfully',
  USER_VERIFIED: 'User verified successfully',
  USER_DELETED: 'User deleted successfully',
  USER_NOT_FOUND: 'User Not Found.',
} as const;
