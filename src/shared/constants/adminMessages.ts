export const AdminMessages={
    MISSING_USER_ID_STATUS:"UserId and valid status ('ACTIVE','SUSPENDED') are required.",
    COMPANY_NOT_FOUND:"Company account not Found.",
    INVALID_ROLE:'Target user account is not a company',
    STATUS_UPDATE:(status:string)=>`Company Status updated to ${status} `
} as const 

export type AdminMessage = typeof AdminMessages[keyof typeof AdminMessages]