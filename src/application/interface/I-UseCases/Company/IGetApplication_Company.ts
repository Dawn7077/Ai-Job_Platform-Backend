import { Application } from "../../../../domain/entities/Application";
import { ApplicationDetailsParamDTO } from "../../../dtos/Company/applicationDetails.dto";


export interface IGetApplication_Company{
    execute(companyId:string,dto:ApplicationDetailsParamDTO): Promise<Application>
}
