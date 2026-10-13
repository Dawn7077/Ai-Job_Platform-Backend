import { VerifyCompanyBodyDTO } from "../../../dtos/Admin/verify-company.dto";

export interface IVerifyCompany{
    execute(payload:VerifyCompanyBodyDTO): Promise<{
        success: boolean;
        message: string;
    }>
}