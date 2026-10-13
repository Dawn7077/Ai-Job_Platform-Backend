export const AdminMessages={
    MISSING_USER_ID_STATUS:"UserId and valid status ('ACTIVE','SUSPENDED') are required.",
    MISSING_USER_ID:"Valid UserId are required.",
    COMPANY_NOT_FOUND:"Company account not Found.",
    UNAUTHORIZED_ACCESS:'Unauthorised access of user management.',
    INVALID_ROLE:'Target user account is not a company',
    STATUS_UPDATE:(status:string)=>`Company Status updated to ${status} `,
    INVALID_STATUS:"Valid status('ACTIVE','SUSPENDED','PENDING') is required.",
    SUCCESS_DELETE:(userId:string)=>`Successfully deleted the user account with user ID:${userId} `
    
} as const 

export type AdminMessage = typeof AdminMessages[keyof typeof AdminMessages]