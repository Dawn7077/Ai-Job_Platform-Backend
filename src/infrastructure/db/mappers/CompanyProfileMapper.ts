import { CompanyProfile as PrismaCompanyProfile } from "@prisma/client";
import { CompanyProfile } from "../../../domain/entities/CompanyProfile";

export class CompanyProfileMapper{
    static toDomain(record:PrismaCompanyProfile):CompanyProfile{
        return new CompanyProfile({
            id:record.id,
            userId:record.userId,
            companyName:record.companyName,
            industry:record.industry ?? "",
            companySize:record.companySize ?? undefined,
            website:record.website ?? undefined,
            description:record?.description ?? undefined,
            location:record.location ?? undefined,
            logoUrl:record.logoUrl ?? undefined,
            createdAt:record.createdAt,
            updatedAt:record.updatedAt,   
        })
    }
}