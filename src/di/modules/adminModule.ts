import { ContainerModule } from "inversify";
import {TYPES} from '../TYPES'

import { GetPendingUsersUseCase } from "../../application/use-case/Admin/GetPendingUseCase";
import { VerifyCompanyUseCase } from "../../application/use-case/Admin/VerfiyingUserCase";
import { GetUsersUseCase } from "../../application/use-case/Admin/GetUsersUseCase";
import { UpdateUserStatusUC } from "../../application/use-case/Admin/UpdateUserStatusUseCase";
import { UpdateUserRoleUC } from "../../application/use-case/Admin/UpdateUserRoleUseCase";
import { DeleteUserUseCase } from "../../application/use-case/Admin/DeleteUserUseCase";
import { AdminController } from "../../presentation/controller/AdminController";

export const adminModule = new ContainerModule(({bind})=>{
    bind(TYPES.IGetPendingUsersUseCase).to(GetPendingUsersUseCase)
    bind(TYPES.IVerifyCompanyUseCase).to(VerifyCompanyUseCase)
    bind(TYPES.IGetUsersUseCase).to(GetUsersUseCase)
    bind(TYPES.IUpdateUserStatusUC).to(UpdateUserStatusUC)
    bind(TYPES.IUpdateUserRoleUC).to(UpdateUserRoleUC)
    
    bind(TYPES.IDeleteUserUseCase).to(DeleteUserUseCase)
    
    bind(TYPES.AdminController).to(AdminController)
})