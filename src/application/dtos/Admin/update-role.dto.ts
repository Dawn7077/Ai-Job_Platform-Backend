import { z } from 'zod'
import { UserRole } from '../../../shared/constants/roles.constant'
 

export const  UpdateRoleParamSchema = z.object({ 
    id:z.string().min(1,'User Id is required')
})
export const  UpdateRoleBodySchema = z.object({ 
    role:z.nativeEnum(UserRole,{
        message:"Invalid user role provided"
    })
})


export type UpdateRoleParamDTO = z.infer<typeof UpdateRoleParamSchema>
export type UpdateRoleBodyDTO = z.infer<typeof UpdateRoleBodySchema>