import { User } from "../entities/User1.js";

export interface IUserRepository{
    findByEmail(email:string): Promise<User|null>
    findById(id:string): Promise<User|null>
    create():Promise<User>;
}