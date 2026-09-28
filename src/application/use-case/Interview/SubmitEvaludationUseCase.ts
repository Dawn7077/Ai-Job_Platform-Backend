import { InterviewEvaluation } from "../../../domain/entities/InterviewEvaluation.js"
import { IInterviewRepository } from "../../../domain/repositories/IInterviewRepo.js"
import { AppError } from "../../../shared/AppErrors.js"
import { StatusCode } from "../../../shared/StatusCode.js"

export interface EvaluationPayload{
    interviewId:string
    technicalScore:number
    communicationScore:number 
    problemSolvingScore:number      
    notes:string        
    decision:"HIRED"|"REJECTED"|"NEXT_ROUND"|"PENDING" 
}

export interface ISubmitInterviewEvaluationUC{
    execute(payload: EvaluationPayload): Promise<InterviewEvaluation>
}

export class SubmitInterviewEvaluationUC implements ISubmitInterviewEvaluationUC{
    constructor(
        private interviewRepo:IInterviewRepository
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