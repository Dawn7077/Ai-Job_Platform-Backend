export interface ExperienceItem {
    title:string 
    company:string
    startDate:string
    endDate?:string
    description?:string
}
export interface EducationItem {
    degree:string 
    institution:string
    startYear:string
    endYear:string
}

export interface CandidateProfileProps{
    id?:string
    userId:string
    firstName:string
    lastName:string
    phone?:string
    headline?:string
    bio?:string
    location?:string
    websiteUrl?:string
    githubUrl?:string
    linkedinUrl?:string
    skills?:string[]
    resumeKey?:string
    experience?:ExperienceItem[]
    education?:EducationItem[]
    createdAt:Date
    updatedAt:Date
}

export class CandidateProfile {
    private props : CandidateProfileProps

    constructor(props:CandidateProfileProps){
        this.props ={
            ...props,
            id:props.id ?? crypto.randomUUID(),
            skills:props.skills ?? [],
            createdAt:props.createdAt ?? new Date(),
            updatedAt:props.updatedAt ?? new Date(),
        }
    }

    get id(){return this.props.id}
    get userId(){return this.props.userId}
    get firstName(){return this.props.firstName}
    get lastName(){return this.props.lastName}
    get fullName(){return `${this.props.firstName} ${this.props.lastName}`}
    get phone():string|undefined{return this.props.phone}
    get headline():string|undefined{return this.props.headline}
    get bio():string|undefined{return this.props.bio}
    get location():string|undefined{return this.props.location}
    get websiteUrl():string|undefined{return this.props.websiteUrl}
    get githubUrl():string|undefined{return this.props.githubUrl}
    get linkedinUrl():string|undefined{return this.props.linkedinUrl}
    get skills():string[]|undefined{return this.props.skills}
    get resumeKey():string|undefined{return this.props.resumeKey}
    get experience():ExperienceItem[]|undefined{return this.props.experience}
    get education():EducationItem[]|undefined{return this.props.education}

    get createdAt():Date{return this.props.createdAt}
    get updatedAt():Date{return this.props.updatedAt}

    public toJSON(){
        return{ ...this.props}
    }
}