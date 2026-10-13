import { z } from 'zod'
import { UserStatus } from '../../../shared/constants/roles'
 

export const  UpdateStatusParamSchema = z.object({ 
    id:z.string().min(1,'User Id is required')
})
export const  UpdateStatusBodySchema = z.object({ 
    status:z.nativeEnum(UserStatus,{
        message:"Invalid user status provided"
    })
})


export type UpdateStatusParamDTO = z.infer<typeof UpdateStatusParamSchema>
export type UpdateStatusBodyDTO = z.infer<typeof UpdateStatusBodySchema>