import { Interview } from "../../../domain/entities/interview.entity";
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository";
import { AppError } from "../../../shared/utils/app-errors.util";
import { StatusCode } from "../../../shared/constants/status-code.constant";

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