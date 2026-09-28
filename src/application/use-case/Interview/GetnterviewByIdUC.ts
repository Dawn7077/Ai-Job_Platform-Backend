import { Interview } from "../../../domain/entities/Interview.js";
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js";
import { AppError } from "../../../shared/AppErrors.js";
import { StatusCode } from "../../../shared/StatusCode.js";

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