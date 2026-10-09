import { User } from "../../domain/entities/User"

export interface ILogin{
    execute(email:string,password:string):Promise<{
        accessToken:string
        refreshToken:string,
        user:User,
        isOnboarding:boolean
    }>
}