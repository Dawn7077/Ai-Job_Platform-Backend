import { Interview } from "../../../domain/entities/Interview";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";

export interface IGetInterviewByIDUseCase{
    execute(id: string): Promise<Interview>
}
export class GetInterviewByIDUseCase implements IGetInterviewByIDUseCase{
    constructor(
        private interviewRepo:IInterviewRepository
    ){}

    async execute(id:string){
        const interview = await this.interviewRepo.findById(id)
        if(!interview){
            throw new AppError(
                'No Interview room found with this interview id',
                StatusCode.NOT_FOUND,
                "INVALID_INTERVIEW_ID"
            )
        }
        return interview

    }
}