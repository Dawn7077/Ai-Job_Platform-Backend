import { User } from "../entities/User.js";

export interface IUserRepository{ //blue print for usecase db tool
    findByEmail(email:string):Promise<User|null>
    findById(id:string):Promise<User|null> 
    updateUser(id:string,data:Object):Promise<void>
    Save(user:User):Promise<void>
}