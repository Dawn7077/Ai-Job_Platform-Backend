import { PrismaClient } from "@prisma/client";
import { ICompanyProfileRepo } from "../../../domain/repositories/ICompanyProfileRepo";
import { CompanyProfile, CompanyProfileProps } from "../../../domain/entities/CompanyProfile";
import { CompanyProfileMapper } from "../mappers/CompanyProfileMapper";
import {  injectable } from "inversify"; 
import { BaseRepository } from "./BaseRepository";

@injectable()
export class PrismaCompanyProfileRepo extends BaseRepository implements ICompanyProfileRepo{
    async findbyUserId(userId: string): Promise<CompanyProfile|null> {
        const raw = await this.prisma.companyProfile.findUnique({
            where:{userId}
        })
        if(!raw)return null

        return CompanyProfileMapper.toDomain(raw)
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
                industry:data.industry ,
                companySize:data.companySize,
                website:data.website,
                location:data.location,
                description:data.description,
                logoUrl:data.logoUrl

            }
        })

        return CompanyProfileMapper.toDomain(raw)
    }
}