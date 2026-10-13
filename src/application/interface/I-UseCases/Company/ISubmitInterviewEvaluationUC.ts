import { InterviewEvaluation } from "../../../../domain/entities/InterviewEvaluation";
import { SubmitEvaluationPayloadDTO } from "../../../dtos/Interview/submitEvaluation.dto";

export interface ISubmitInterviewEvaluationUC{
    execute(payload:SubmitEvaluationPayloadDTO): Promise<InterviewEvaluation>
}