import { ContainerModule } from "inversify";
import {TYPES} from '../TYPES'

import { GetPendingUsersUseCase } from "../../application/use-case/Admin/get-pending.use-case";
import { VerifyCompanyUseCase } from "../../application/use-case/Admin/verify-user.use-case";
import { GetUsersUseCase } from "../../application/use-case/Admin/get-users.use-case";
import { UpdateUserStatusUC } from "../../application/use-case/Admin/update-user-status.use-case";
import { UpdateUserRoleUC } from "../../application/use-case/Admin/update-user-role.use-case";
import { DeleteUserUseCase } from "../../application/use-case/Admin/delete-user.use-case";
import { AdminController } from "../../presentation/controller/admin.controller";

export const adminModule = new ContainerModule(({bind})=>{
    bind(TYPES.IGetPendingUsersUseCase).to(GetPendingUsersUseCase)
    bind(TYPES.IVerifyCompanyUseCase).to(VerifyCompanyUseCase)
    bind(TYPES.IGetUsersUseCase).to(GetUsersUseCase)
    bind(TYPES.IUpdateUserStatusUC).to(UpdateUserStatusUC)
    bind(TYPES.IUpdateUserRoleUC).to(UpdateUserRoleUC)
    
    bind(TYPES.IDeleteUserUseCase).to(DeleteUserUseCase)
    
    bind(TYPES.AdminController).to(AdminController)
})