import { InterviewEvaluation } from "../../../../domain/entities/interview-evaluation.entity";
import { SubmitEvaluationPayloadDTO } from "../../../dtos/Interview/submit-evaluation.dto";

export interface ISubmitInterviewEvaluationUC{
    execute(payload:SubmitEvaluationPayloadDTO): Promise<InterviewEvaluation>
}