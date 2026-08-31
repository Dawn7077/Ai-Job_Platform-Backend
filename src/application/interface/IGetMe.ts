import { User } from "../../domain/entities/User.js";

export interface IGetMe{
    execute(userId:string):Promise<User>
}