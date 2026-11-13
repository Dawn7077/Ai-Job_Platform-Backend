import {
  IUserRepository,
  UserFilterQueryParams,
} from '../../../domain/repositories/i-user.repository';
import { UserStatus, UserRole } from '../../../domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../di/types';
import { IGetUsersUseCase } from '../../interface/use-cases/admin/i-get-users.use-case';
import { GetUsersQueryDTO } from '../../dtos/admin/get-users.dto';

@injectable()
export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository
  ) {}

  async execute(query: GetUsersQueryDTO) {
    // const page = Math.max(1,parseInt(query.page || '1',10))
    // const limit = Math.max(1,parseInt(query.limit || '10',10))

    const params: UserFilterQueryParams = {
      page: query.page,
      limit: query.limit,
      role: (query.role as UserRole) || undefined,
      status: (query.status as UserStatus) || undefined,
      search: query.search || undefined,
    };

    const result = await this.userRepo.findUsers(params);

    return {
      users: result.users.map((user) => user.toJSON()),
      pagination: {
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        limit: query.limit,
      },
    };
  }
}
