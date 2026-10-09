import { Interview } from "../../../../domain/entities/Interview";

export interface IGetCompanyInterviewUC{
    execute(companyId: string): Promise<Interview[]>
}
