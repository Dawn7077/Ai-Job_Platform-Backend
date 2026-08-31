import { User, UserRole } from "../../domain/entities/User.js"
export interface IRegisterUser{
    execute(name:string,email:string,password:string,role:UserRole):Promise<{
        accessToken:string,
        refreshToken:string,
        user:User
    }>
}