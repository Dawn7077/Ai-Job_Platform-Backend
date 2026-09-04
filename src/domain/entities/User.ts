
export type UserRole = "CANDIDATE"|"COMPANY"|"ADMIN"
export type UserStatus = "ACTIVE" | "SUSPENDED" |"PENDING"

export interface UserProps {
  id?:string;
  name:string;
  email:string;
  passwordHash?:string;
  role:UserRole;
  status?:UserStatus;
  createdAt?:Date; 
  updatedAt?:Date;
}

export class User {
  // private props:Required<UserProps>
  private props:Required<Omit<UserProps,'updatedAt'>>  & {updatedAt?:Date}
  constructor (props:UserProps){
    this.props = { 
      id:props.id?? crypto.randomUUID(),
      name:props.name,
      email:props.email,
      passwordHash:props.passwordHash ?? '',
      role:props.role,
      status:props.status ?? 'ACTIVE',
      createdAt:props.createdAt ?? new Date()
    }
  }

  getId():string{return this.props.id}
  getEmail():string{return this.props.email}
  getName():string{return this.props.name}
  getPasswordHash():string{return this.props.passwordHash ?? ''}
  getRole():UserRole{return this.props.role}
  getStatus():UserStatus { return this.props.status} 

  public isActive():boolean{
    return this.props.status === "ACTIVE"
  }

  public toJSON(){
    return{
      id:this.props.id,
      name:this.props.name,
      email:this.props.email,
      role:this.props.role,
      status:this.props.status,
      createdAt:this.props.createdAt,
      updatedAt:this.props.updatedAt
    }
  }
}