import { DeleteUserParamDTO } from '../../../dtos/admin/delete-users.dto';

export interface IDeleteUserUseCase {
  execute(id: DeleteUserParamDTO, adminId: string): Promise<void>;
}
