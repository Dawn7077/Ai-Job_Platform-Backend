import { PrismaClient } from "@prisma/client";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { CandidateProfile, CandidateProfileProps,} from "../../../domain/entities/CandidateProfile";
import { injectable } from "inversify" 
import { CandidateProfileMapper } from "../mappers/CandidateProfileMapper";
import { BaseRepository } from "./BaseRepository";


@injectable() 
export class PrismaCandidateProfileRepo extends BaseRepository implements ICandidateProfileRepository{
     
    async findByUserId(userId: string): Promise<CandidateProfile | null> {
        const raw = await this.prisma.candidateProfile.findUnique({
            where:{userId},
        }) 
        
        if(!raw) return null

        return CandidateProfileMapper.toDomain(raw)
    }

    async upsertProfile(userId: string, data: Partial<CandidateProfileProps>): Promise<CandidateProfile> {
        const raw = await this.prisma.candidateProfile.upsert({
            where:{userId},
            update:{
                firstName:data.firstName,
                lastName:data.lastName,
                phone:data.phone,
                headline:data.headline,
                bio:data.bio,
                location:data.location,
                webSiteUrl:data.websiteUrl,
                githubUrl:data.githubUrl,
                linkedinUrl:data.linkedinUrl,
                skills:data.skills,
                resumeKey:data.resumeKey,
                experience:(data.experience as any) ?? [],
                education:(data.education as any)?? [],
            },
            create:{
                userId,
                firstName:data.firstName || "",
                lastName:data.lastName || "",
                phone:data.phone,
                headline:data.headline,
                bio:data.bio,
                location:data.location,
                webSiteUrl:data.websiteUrl,
                githubUrl:data.githubUrl,
                linkedinUrl:data.linkedinUrl,
                skills:data.skills,
                resumeKey:data.resumeKey,
                experience:data.experience as any,
                education:data.education as any,
            }
        })

        return CandidateProfileMapper.toDomain(raw)
    }

    async updateResumeKey(userId: string, resumeKey: string): Promise<CandidateProfile> {
        const raw = await this.prisma.candidateProfile.update({
            where:{userId},
            data:{resumeKey}
        })

        return CandidateProfileMapper.toDomain(raw)
    }

}