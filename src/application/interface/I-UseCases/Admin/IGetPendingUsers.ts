import { User } from "../../../domain/entities/User";

export interface IGetPendingUsers{
    execute(): Promise<User[]>
}