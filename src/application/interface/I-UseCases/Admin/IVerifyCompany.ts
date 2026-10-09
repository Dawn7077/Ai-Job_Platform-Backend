export interface IVerifyCompany{
    execute(userId: string, status: "ACTIVE" | "SUSPENDED",rejectionReason:string): Promise<{
        success: boolean;
        message: string;
    }>
}