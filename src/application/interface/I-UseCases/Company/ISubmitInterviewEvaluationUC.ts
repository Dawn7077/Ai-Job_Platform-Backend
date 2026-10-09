import { InterviewEvaluation } from "../../../../domain/entities/InterviewEvaluation";
import { EvaluationPayload } from "../../../use-case/Interview/SubmitEvaludationUseCase";

export interface ISubmitInterviewEvaluationUC{
    execute(payload: EvaluationPayload): Promise<InterviewEvaluation>
}