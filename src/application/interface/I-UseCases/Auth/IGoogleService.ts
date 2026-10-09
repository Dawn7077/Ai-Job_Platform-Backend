import { User } from "../../../domain/entities/User";
import { GoogleLoginInput } from "../../use-case/Auth/GoogleLoginUseCase";

export interface IGoogleService{
    execute(inputData:GoogleLoginInput): Promise<
    | {user:User; requiresApproval:true ; message:string}
    | { accessToken: string; refreshToken: string; user:User;isOnboarding:boolean}>
}