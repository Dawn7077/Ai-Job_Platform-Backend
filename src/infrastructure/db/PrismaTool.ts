import {PrismaClient } from '@prisma/client'
import { IUserRepository } from '../../domain/repositories/IUserRepository.js'
import { User, UserRole, UserStatus } from '../../domain/entities/User.js'

// const prisma  = new PrismaClient()

export class PrismaTool implements IUserRepository{
    constructor(private prisma:PrismaClient){}

   
    async Save(user: User): Promise<void> {
        await this.prisma.user.create({
            data:{
                name:user.getName(),
                email:user.getEmail(),
                passwordHash:user.getPasswordHash(),
                role:user.getRole() as UserRole,
                status:user.getStatus() as UserStatus
            }
        })

        
    }


    async findByEmail(email: string): Promise<User | null> {
        const record  = await this.prisma.user.findUnique({
            where:{email}
        })
        if(!record)return null

        return new User({
            id:record.id, 
            name:record.name,
            email:record.email,
            passwordHash:record.passwordHash,
            role:record.role,
            status:record.status,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt
        })
    }

    async findById(id: string): Promise<User | null> {
        const record  = await this.prisma.user.findUnique({
            where:{id}
        })
        if(!record)return null

        return new User({
            id:record.id,
            name:record.name,
            email:record.email,
            passwordHash:record.passwordHash,
            role:record.role,
            status:record.status,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt
        })
    }

    async updateUser(id: string, data: Object): Promise<void> {
        await this.prisma.user.update({
            where:{id},
            data:data
        })
    }

    
     
}
