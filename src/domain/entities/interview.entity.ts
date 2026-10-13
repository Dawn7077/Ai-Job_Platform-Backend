export type InterviewStatusType = "SCHEDULED" | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

export interface InterviewProps{
    id?:string
    applicationId:string
    candidateId:string
    companyId:string
    roomKey?:string
    scheduledAt:Date
    status?:InterviewStatusType
    createdAt?:Date
    updatedAt?:Date
}

export class Interview{
    private props:Required<InterviewProps>
    constructor(props:InterviewProps){
        this.props ={
            ...props,
            id:props.id ?? crypto.randomUUID(),
            roomKey:props.roomKey ?? crypto.randomUUID(),
            status:props.status ?? "SCHEDULED",
            createdAt:props.createdAt ?? new Date(),
            updatedAt:props.updatedAt ?? new Date(),
        }
    }

    get id(): string {return this.props.id!}
    get applicationId(): string{return this.props.applicationId}
    get candidateId(): string   {return this.props.candidateId}
    get companyId(): string  {return this.props.companyId}
    get roomKey():  string {return this.props.roomKey!}
    get scheduledAt(): Date  {return this.props.scheduledAt}
    get status(): InterviewStatusType  {return this.props.status!}
    get createdAt(): Date  {return this.props.createdAt!}
    get updatedAt(): Date {return this.props.updatedAt!}
    
//     public updateStatus(status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
//       this.props.status = status;
//       this.props.updatedAt = new Date();
//      }

    toJSON(){
        return { ...this.props }
    }
}