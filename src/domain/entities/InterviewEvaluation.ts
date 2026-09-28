export interface InterviewEvaluationProps{
    id?:string      
    interviewId:string
    technicalScore:number
    communicationScore:number 
    problemSolvingScore:number      
    notes:string        
    decision:"HIRED"|"REJECTED"|"NEXT_ROUND"|"PENDING"
    createdAt?:Date      
}

export class InterviewEvaluation{
    private props:InterviewEvaluationProps
    constructor(props:InterviewEvaluationProps){
        this.props ={
            ...props,
            id:props.id ?? crypto.randomUUID(),  
            createdAt:props.createdAt ?? new Date(), 
        }
    }

    get id():string {return this.props.id!}
    get interviewId(){return this.props.interviewId}
    get technicalScore(): number {return this.props.technicalScore}
    get communicationScore():number{return this.props.communicationScore}
    get problemSolvingScore():number {return this.props.problemSolvingScore} 
    get notes(): string  {return this.props.notes}
    get decision() {return this.props.decision}
    get createdAt(): Date {return this.props.createdAt!}
    

    toJSON(){
        return { ...this.props }
    }
}