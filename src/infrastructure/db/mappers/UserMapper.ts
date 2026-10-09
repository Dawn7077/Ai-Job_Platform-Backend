import { User as PrismaUser } from "@prisma/client";
import {User,UserRole,UserStatus} from "../../../domain/entities/User";

export class UserMapper{
    static toDomain(record:PrismaUser):User{
        return new User({
            id:record.id,
            name:record.name,
            email:record.email,
            passwordHash:record.passwordHash,
            role:record.role as UserRole,
            status:record.status as UserStatus,
            rejectionReason:record.rejectionReason ?? undefined,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt
        })
    }
}