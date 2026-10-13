import { inject, injectable } from "inversify"
import { InterviewEvaluation } from "../../../domain/entities/interview-evaluation.entity"
import { IInterviewRepository } from "../../../domain/repositories/i-interview.repository"
import { AppError } from "../../../shared/utils/app-errors.util"
import { StatusCode } from "../../../shared/constants/status-code.constant"
import { ISubmitInterviewEvaluationUC } from "../../interface/use-cases/Company/i-submit-interview-evaluation.use-case"
import { TYPES } from "../../../di/TYPES"
import { SubmitEvaluationPayloadDTO } from "../../dtos/Interview/submit-evaluation.dto"

// export interface EvaluationPayload{
//     interviewId:string
//     technicalScore:number
//     communicationScore:number 
//     problemSolvingScore:number      
//     notes:string        
//     decision:"HIRED"|"REJECTED"|"NEXT_ROUND"|"PENDING" 
// }


@injectable()
export class SubmitInterviewEvaluationUC implements ISubmitInterviewEvaluationUC{
    constructor(
        @inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository
    ){}

    async execute(payload:SubmitEvaluationPayloadDTO){
        const interview = await this.interviewRepo.findById(payload.interviewId)
        if(!interview){
            throw new AppError(
                'Interview NOT FOUND',
                StatusCode.NOT_FOUND,
                "NOT_FOUND"
            )
        }
        const evaluation = new InterviewEvaluation(payload)
        const savedEval = await this.interviewRepo.createEvaluation(evaluation)

        await this.interviewRepo.updateStatus(payload.interviewId,'COMPLETED')
        
        return savedEval

    }
}   