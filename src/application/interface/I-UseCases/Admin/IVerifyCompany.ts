import { VerifyCompanyBodyDTO } from "../../../dtos/Admin/VerifyCompany.dto";

export interface IVerifyCompany{
    execute(payload:VerifyCompanyBodyDTO): Promise<{
        success: boolean;
        message: string;
    }>
}