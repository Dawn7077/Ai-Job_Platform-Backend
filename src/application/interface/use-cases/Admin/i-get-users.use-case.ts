import { UserRole, UserStatus } from '../../../../domain/entities/user.entity';
import { GetUsersQueryDTO } from '../../../dtos/admin/get-users.dto';

export interface IGetUsersUseCase {
  execute(query: GetUsersQueryDTO): Promise<{
    users: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      status: UserStatus;
      createdAt: Date;
      updatedAt: Date | undefined;
    }[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
      limit: number;
    };
  }>;
}
