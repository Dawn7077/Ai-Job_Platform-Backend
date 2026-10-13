import { DeleteUserParamDTO } from "../../../dtos/Admin/delete-users.dto";

export interface IDeleteUserUseCase{
    execute(id:DeleteUserParamDTO,adminId: string): Promise<void>
}