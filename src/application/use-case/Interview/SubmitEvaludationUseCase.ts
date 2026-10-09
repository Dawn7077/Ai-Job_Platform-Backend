import { inject, injectable } from "inversify"
import { InterviewEvaluation } from "../../../domain/entities/InterviewEvaluation"
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo"
import { AppError } from "../../../shared/AppErrors"
import { StatusCode } from "../../../shared/StatusCode"
import { ISubmitInterviewEvaluationUC } from "../../interface/I-UseCases/Company/ISubmitInterviewEvaluationUC"
import { TYPES } from "../../../di/TYPES"

export interface EvaluationPayload{
    interviewId:string
    technicalScore:number
    communicationScore:number 
    problemSolvingScore:number      
    notes:string        
    decision:"HIRED"|"REJECTED"|"NEXT_ROUND"|"PENDING" 
}


@injectable()
export class SubmitInterviewEvaluationUC implements ISubmitInterviewEvaluationUC{
    constructor(
        @inject(TYPES.IInterviewRepo) private interviewRepo:IInterviewRepository
    ){}

    async execute(payload:EvaluationPayload){
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