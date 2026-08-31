import { User } from "../../domain/entities/User.js"

export interface ILogin{
    execute(email:string,password:string):Promise<{
        accessToken:string
        refreshToken:string,
        user:User
    }>
}