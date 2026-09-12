export const AuthMessages = {
    // middlewares and general msg
    NO_TOKEN:'Unauthorized: NO Token provided.',
    INVALID_TOKEN:'Invalid or expired access token',
    INTERNAL_ERROR:"An unexpected internal server error occured.",
    UNAUTHORIZED:"UnAuthorized:User identity not found",
    FORBIDDEN:"Forbidden:You do not have the permission to access this resource",

    // Req Validation or Missing Fields
    MISSING_FEILDS:"Missing required fields!",
    MISSING_EMAIL_PASSWORD:"Missing required email or password fields!",
    MISSING_EMAIL:"Missing required email field!",
    MISSING_TOKEN_ROLE:"Missing Token or Role fields!",
    MISSING_OTP_EMAIL:"Email and OTP are required!",

    // Authentication and Authorization 
    INVALID_CREDENTIALS:'Invalid email or password credentials',
    COMPANY_PENDING:"Your company account is pending admin approval. Please wait for the verification.",
    COMPANY_PENDING_GOOGLE:"Your company account is pending admin verification. You cannot log in yet. Please wait for the verification.",
    COMPANY_SUSPENDED:"Your company account has been suspended.",

    // OTP VERIFICATIONS
    OTP_EXPIRED:"OTP has expired or request is invalid.",
    INVALID_OTP:"Invalid OTP code provided.",
    OTP_SENT:"OTP sent successfully to your email.",
    EMAIL_VERIFY_MSG:"Verify your email for account sign-up",
    COOLDOWN_TTL:(ttl:string|number)=>`Please wait ${ttl} seconds before requesting a new OTP`,


    // Success msgs
    REGISTER_SUCCESS:"User registered to our database succesfully",
    COMPANY_REGISTER_SUCCESS_PENDING:"Company account registered successfully. Please wait for verification before loggin in.",
    LOGOUT_SUCCESS:'Logged out successfully',
    RESET_SUCCESS:"Password reset successful. Please login with your new password.",
    USER_EXISTS:"Already existing user.",
    USER_NOT_FOUND:"User not found."
    

}as const 

export type AuthMessage  = typeof AuthMessages[keyof typeof AuthMessages]