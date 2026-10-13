import {PrismaClient } from '@prisma/client'
import { IUserRepository, PaginatedUsersList, UserFilterQueryParams } from '../../../domain/repositories/IUserRepository'
import { User, UserRole, UserStatus } from '../../../domain/entities/User'
import { inject, injectable } from "inversify" 
import { UserMapper } from '../mappers/UserMapper'
import { BaseRepository } from './BaseRepository'
import { logger } from '../../../shared/utils/loggers'
import { TYPES } from '../../../di/TYPES'
 
@injectable()
export class PrismaTool extends BaseRepository implements IUserRepository{
    constructor(@inject(TYPES.PrismaClient)protected readonly prisma: PrismaClient){
        super(prisma)
    }
    async Save(user: User): Promise<void> {
        await this.prisma.user.upsert({
            where:{email:user.getEmail()},
            update:{
                name:user.getName(),
                email:user.getEmail(),
                passwordHash:user.getPasswordHash(),
                role:user.getRole() as UserRole,
                status:user.getStatus() as UserStatus,
                rejectionReason:user.getRejectionReason()
            },
            create:{
                name:user.getName(),
                email:user.getEmail(),
                passwordHash:user.getPasswordHash(),
                role:user.getRole() as UserRole,
                status:user.getStatus() as UserStatus,
                rejectionReason:user.getRejectionReason()
            }
        })

        
    }


    async findByEmail(email: string): Promise<User | null> {
        logger.error(`findbyEmail => this:${this.prisma}`)
        const record  = await this.prisma.user.findUnique({
            where:{email}
        })
        logger.error(`findbyEmail => record:${record}`)
        if(!record)return null

        return UserMapper.toDomain(record)
    }

    async findById(id: string): Promise<User | null> {
        const record  = await this.prisma.user.findUnique({
            where:{id}
        })
        if(!record)return null

        return UserMapper.toDomain(record)
    }

    async findPendingUsers(): Promise<User[]> {
        const records = await this.prisma.user.findMany({
            where:{
                status:'PENDING',
                role:'COMPANY'
            }
        })

        return records.map(record=> UserMapper.toDomain(record))
    }

    async updateUser(id: string, data: Object): Promise<void> {
        await this.prisma.user.update({
            where:{id},
            data:data
        })
    }
    //for admin search
    async findUsers(params:UserFilterQueryParams):Promise<PaginatedUsersList>{
        const {page=1,limit=1,role,status,search} = params
        const skip = (page-1)*limit

        const where = {
            ...(role && {role}),
            ...(status && {status}),
            ...(search?.trim() && {
                OR:[
                    {
                        name:{contains:search,
                        // mode:"insensitive" as const
                        }},
                    {email:{
                        contains:search,
                        // mode:"insensitive" as const
                    }}
                ]
            }),
        }

        const [records,total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take:limit,
                orderBy:{createdAt:'desc'}
            }),
            this.prisma.user.count({where})
        ])

        const users = records.map(record=>UserMapper.toDomain(record))
        const totalPages = limit>0? Math.ceil(total/limit):1

        return {
            users, total,
            totalPages,
            page,

        }
    
    }

    async HardDeleteUser(id: string): Promise<void> {
        await this.prisma.user.delete({
            where:{id},
        })
    }

    async deleteUser(id: string): Promise<void> {
        await this.prisma.user.update({
            where:{id},
            data:{
                status:"DELETED",
                deletedAt:new Date()
            }
        })
    }

    
     
}
