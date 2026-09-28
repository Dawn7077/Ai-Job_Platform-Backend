import { PrismaClient } from "@prisma/client";
import { ICompanyProfileRepo } from "../../domain/repositories/ICompanyProfileRepo.js";
import { CompanyProfile, CompanyProfileProps } from "../../domain/entities/CompanyProfile.js";

export class PrismaCompanyProfileRepo implements ICompanyProfileRepo{
    constructor(private prisma:PrismaClient){}
    async findbyUserId(userId: string): Promise<CompanyProfile|null> {
        const raw = await this.prisma.companyProfile.findUnique({
            where:{userId}
        })
        if(!raw)return null

        return new CompanyProfile({
            id:raw?.id,
            userId:raw?.userId,
            companyName:raw?.companyName,
            industry:raw?.industry ?? "",
            companySize:raw?.companySize ?? undefined,
            website:raw?.website ?? undefined,
            description:raw?.description ?? undefined,
            location:raw?.location ?? undefined,
            logoUrl:raw?.logoUrl ?? undefined,
            createdAt:raw?.createdAt,
            updatedAt:raw?.updatedAt,            
        })
    }

    async upsertProfile(userId: string, data: Partial<CompanyProfileProps>): Promise<CompanyProfile> {
        const raw = await this.prisma.companyProfile.upsert({
            where:{userId},
            update:{
                companyName:data.companyName,
                industry:data.industry,
                companySize:data.companySize,
                website:data.website,
                location:data.location,
                logoUrl:data.logoUrl,
                description:data.description,
                createdAt:data.createdAt,
                updatedAt:data.updatedAt,
            },
            create:{
                userId,
                companyName:data.companyName || "",
                industry:data.industry,
                companySize:data.companySize,
                website:data.website,
                location:data.location,
                description:data.description,
                logoUrl:data.logoUrl

            }
        })

        return new CompanyProfile({
            id:raw?.id,
            userId:raw?.userId,
            companyName:raw?.companyName,
            industry:raw?.industry  ?? "",
            companySize:raw?.companySize ?? undefined,
            website:raw?.website ?? undefined,
            description:raw?.description ?? undefined,
            location:raw?.location ?? undefined,
            logoUrl:raw?.logoUrl ?? undefined,
            createdAt:raw?.createdAt,
            updatedAt:raw?.updatedAt,            
        })
    }
}