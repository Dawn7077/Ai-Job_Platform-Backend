export const TYPES = {
    // Database & External Services
    PrismaClient: Symbol.for('PrismaClient'),
    MongoClient: Symbol.for('MongoClient'),
    RedisClient: Symbol.for('RedisClient'),
    S3Client: Symbol.for('S3Client'),

    // configs
    JwtSecret: Symbol.for('JwtSecret'),

    // Repositories
    IUserRepository: Symbol.for("IUserRepository"),
    ICandidateProfileRepo:Symbol.for("ICandidateProfileRepo"),
    ICompanyProfileRepo:Symbol.for("ICompanyProfileRepo"),
    IApplicationRepo:Symbol.for('IApplicationRepo'), 
    IInterviewRepo:Symbol.for("IInterviewRepo"),
    IJobRepo:Symbol.for('IJobRepo'),

    // Services & Tools
    IHashService: Symbol.for('IHashService'),
    ITokenService: Symbol.for('ITokenService'),
    IRefreshToken:Symbol.for('IRefreshToken'),
    IRedisService: Symbol.for('IRedisService'),
    IEmailService: Symbol.for('IEmailService'),
    IGoogleAuthService: Symbol.for('IGoogleAuthService'),
   
    // AI & Storage services
    GatewayModel: Symbol.for('GatewayModel'),
    EmbeddingsModel: Symbol.for("EmbeddingsModel"),
    IVectorSearchService: Symbol.for('IVectorSearchService'),
    IR2StorageService: Symbol.for('IR2StorageService'),
    IResumeParserService: Symbol.for('IResumeParserService'),
    IMentorAgent:Symbol.for('IMentorAgent'),
    IntentClassifier:Symbol.for('IntentClassifier'),


//Auth Use Cases
    IRegisterUseCase: Symbol.for('IRegisterUseCase'),
    ILoginUseCase: Symbol.for('ILoginUseCase'),
    ISignupOTPUseCase: Symbol.for('ISignupOTPUseCase'),
    IGoogleLoginUseCase: Symbol.for('IGoogleLoginUseCase'),
    IForgotPasswordUseCase: Symbol.for('IForgotPasswordUseCase'),
    IResetPasswordUseCase: Symbol.for('IResetPasswordUseCase'),
    IReapplyVerificationUseCase: Symbol.for('IReapplyVerificationUseCase'),
    IGetMeUseCase: Symbol.for('IGetMeUseCase'),


//Candidate Use Cases
    IGetActiveJobsUseCase: Symbol.for('IGetActiveJobsUseCase'),
    IGetActiveJobById: Symbol.for('IGetActiveJobById'),
    IApplyJobUseCase:Symbol.for('IApplyJobUseCase'),

    IGetAllApplicationsUseCase:Symbol.for('IGetAllApplicationsUseCase'),
    IGetCandidateApplicationUC:Symbol.for('IGetCandidateApplicationUC'),

    IGetProfileCanidateUseCase:('IGetProfileCanidateUseCase'),
    ISaveCandidateProfile:Symbol.for('ISaveCandidateProfile') ,

    IGetCandidateInterviewUC:Symbol.for('IGetCandidateInterviewUC'),
    //resume usecase 
    IGetUploadResumeUrlUseCase:Symbol.for('IGetUploadResumeUrlUseCase'),
    IProcessResumeUseCase:Symbol.for('IProcessResumeUseCase'),
    IGetResumeUrlUseCase:Symbol.for('IGetResumeUrlUseCase'),
    IGetResumeTextUseCase:Symbol.for('IGetResumeTextUseCase'),
    // ai chat
    IMentorChatUseCase: Symbol.for("IMentorChatUseCase"),

// Company Use Cases
    ICreateJob:Symbol.for('ICreateJob'),
    IGetJobsUseCase:Symbol.for('IGetJobsUseCase'),
    IGetJobsTypeUseCase:Symbol.for('IGetJobsTypeUseCase'),
    IUpdateApplicationStageUseCase:Symbol.for('IUpdateApplicationStageUseCase'),
    IGetAllApplications_Company:Symbol.for('IGetAllApplications_Company'),
    IGetApplication_Company:Symbol.for('IGetApplication_Company'),
    IGetApplicationByJobIdUC:Symbol.for('IGetApplicationByJobIdUC'),
    IScheduleInterviewUC:Symbol.for('IScheduleInterviewUC'),
    IGetInterviewByRoomKeyUC:Symbol.for('IGetInterviewByRoomKeyUC'),
    ISubmitInterviewEvaluationUC:Symbol.for('ISubmitInterviewEvaluation'),
    IGetCompanyInterviewUC:Symbol.for('IGetCompanyInterviewUC'),
    ISaveProfileCompanyUC:Symbol.for('ISaveProfileCompanyUC'),
    IGetProfileCompanyUC:Symbol.for('IGetProfileCompanyUC'),

// Admin Use Case
    IGetPendingUsersUseCase: Symbol.for('IGetPendingUsersUseCase'),
    IVerifyCompanyUseCase: Symbol.for('IVerifyCompanyUseCase'),
    IGetUsersUseCase: Symbol.for('IGetUsersUseCase'),
    IUpdateUserStatusUC: Symbol.for('IUpdateUserStatusUC'),
    IUpdateUserRoleUC: Symbol.for('IUpdateUserRoleUC'),
    IDeleteUserUseCase: Symbol.for('IDeleteUserUseCase'),
    
    


    // Controllers
    AuthController: Symbol.for('AuthController'),
    CandidateController:Symbol.for('CandidateController'),
    CompanyController:Symbol.for('CompanyController'),
    AdminController:Symbol.for('AdminController')
    
}