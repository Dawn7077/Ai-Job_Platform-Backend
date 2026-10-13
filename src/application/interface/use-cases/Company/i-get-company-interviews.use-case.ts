import { Interview } from "../../../../domain/entities/interview.entity";

export interface IGetCompanyInterviewUC{
    execute(companyId: string): Promise<Interview[]>
}
