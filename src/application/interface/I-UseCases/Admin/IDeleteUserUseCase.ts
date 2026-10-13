import { DeleteUserParamDTO } from "../../../dtos/Admin/DeleteUsers.dto";

export interface IDeleteUserUseCase{
    execute(id:DeleteUserParamDTO,adminId: string): Promise<void>
}