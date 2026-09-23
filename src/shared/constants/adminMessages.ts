export const AdminMessages={
    MISSING_USER_ID_STATUS:"UserId and valid status ('ACTIVE','SUSPENDED') are required.",
    MISSING_USER_ID:"Valid UserId are required.",
    COMPANY_NOT_FOUND:"Company account not Found.",
    INVALID_ROLE:'Target user account is not a company',
    STATUS_UPDATE:(status:string)=>`Company Status updated to ${status} `,
    INVALID_STATUS:"Valid status('ACTIVE','SUSPENDED','PENDING') is required.",
    
} as const 

export type AdminMessage = typeof AdminMessages[keyof typeof AdminMessages]