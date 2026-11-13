import { VerifyCompanyBodyDTO } from '../../../dtos/admin/verify-company.dto';

export interface IVerifyCompany {
  execute(payload: VerifyCompanyBodyDTO): Promise<{
    success: boolean;
    message: string;
  }>;
}
