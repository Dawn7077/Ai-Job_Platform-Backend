export enum JobTypes{
    REMOTE='REMOTE',
    HYBRID='HYBRID',
    ONSITE='ONSITE'
}

export interface JobProps{
    id?:string
    companyId:string
    title:string
    jobType:"REMOTE"|"HYBRID"|"ONSITE"
    description:string
    skills:string[]
    salaryMax:number
    salaryMin:number
    status?:'OPEN'|'CLOSED'
    createdAt?:Date
    updatedAt?:Date
}


export class Job{
    private props:Required<JobProps>

    constructor(props:JobProps){
        this.props={
            id:props.id ?? crypto.randomUUID(),
            companyId:props.companyId,
            title:props.title,
            jobType:props.jobType,
            description:props.description,
            skills:props.skills,
            salaryMax:props.salaryMax,
            salaryMin:props.salaryMin,
            status:props.status??'OPEN',
            createdAt:props.createdAt ?? new Date(),
            updatedAt:props.updatedAt ?? new Date(),

        }
    }

    public get id():string{return this.props.id}
    public get companyId():string{return this.props.companyId}
    public get title():string{return this.props.title}
    public get jobType():"REMOTE"|"HYBRID"|"ONSITE"{return this.props.jobType}
    public get description():string{return this.props.description}
    public get skills():string[]{return this.props.skills}
    public get salaryMax():number{return this.props.salaryMax}
    public get salaryMin():number{return this.props.salaryMin}
    public get status():'OPEN'|'CLOSED'{return this.props.status} 

    public toJSON(){
        return{ ...this.props }
    }

}