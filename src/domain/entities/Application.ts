export enum ApplicationStage{
  APPLIED = "APPLIED",
  SCREENING ="SCREENING",
  SHORTLISTED = "SHORTLISTED",
  INTERVIEW = "INTERVIEW",
  OFFER = "OFFER",
  HIRED = "HIRED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export interface ApplicationProps{
    id?:string
    jobId:string
    candidateId:string
    stage:ApplicationStage
    resumeUrl?:string | null
    createdAt:Date
    updatedAt:Date
}

export class Application {
    private props :Required<ApplicationProps>

    constructor( props : ApplicationProps){
        this.props={
            id:props.id ?? crypto.randomUUID(),
            jobId:props.jobId,
            candidateId:props.candidateId,
            stage:props.stage,
            resumeUrl:props.resumeUrl ?? null,
            createdAt:props.createdAt ?? new Date(),
            updatedAt:props.updatedAt ?? new Date(),
        }
    }

    get id():string{return this.props.id}
    get candidateId():string{return this.props.candidateId}
    get jobId():string{return this.props.jobId}
    get stage():ApplicationStage{return this.props.stage}
    get resumeUrl():string | null| undefined {return this.props.resumeUrl}
    get createdAt():Date{return this.props.createdAt}
    get updatedAt():Date{return this.props.updatedAt}

    toJSON():ApplicationProps{
        return {...this.props}
    }
}