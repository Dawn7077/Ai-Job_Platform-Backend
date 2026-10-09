import { User, UserRole, UserStatus } from "../entities/User";

export interface UserFilterQueryParams{
    page:number
    limit:number
    role?:UserRole
    status?:UserStatus
    search?:string
}
export interface PaginatedUsersList{
    users:User[]
    total:number
    page:number
    totalPages:number
}

export interface IUserRepository{ //blue print for usecase db tool
    findByEmail(email:string):Promise<User|null>
    findById(id:string):Promise<User|null> 
    updateUser(id:string,data:Object):Promise<void>
    Save(user:User):Promise<void>
    findPendingUsers():Promise<User[]>

    findUsers(params:UserFilterQueryParams):Promise<PaginatedUsersList>
    deleteUser(id:string):Promise<void>
}