
export interface CompanyProfileProps{
    id?:string
    userId:string
    companyName:string
    industry:string
    companySize?:string
    website?:string 
    location?:string 
    description?:string
    logoUrl?:string
    createdAt?:Date
    updatedAt?:Date
}



export class CompanyProfile {
    private props : CompanyProfileProps

    constructor(props:CompanyProfileProps){
        this.props ={
            ...props,
            id:props.id ?? crypto.randomUUID(), 
            createdAt:props.createdAt ?? new Date(),
            updatedAt:props.updatedAt ?? new Date(),
        }
    }

    get id():string{return this.props.id!}
    get userId():string{return this.props.userId} 
    get companyName():string {return this.props.companyName} 
    get industry():string{return this.props.industry} 
    get companySize():string|undefined{return this.props.companySize}

    get website():string|undefined{return this.props.website } 
    get location():string|undefined{return this.props.location}
    get description():string|undefined{return this.props.description } 
    get logoUrl():string|undefined{return this.props.logoUrl } 

    get createdAt():Date{return this.props.createdAt!}
    get updatedAt():Date{return this.props.updatedAt!}

    public toJSON(){
        return{ ...this.props}
    }
}