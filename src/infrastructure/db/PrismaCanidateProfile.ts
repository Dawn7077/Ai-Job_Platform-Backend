import { PrismaClient } from "@prisma/client";
import { ICandidateProfileRepository } from "../../domain/repositories/ICandidateProfileRepo.js";
import { CandidateProfile, CandidateProfileProps, EducationItem, ExperienceItem } from "../../domain/entities/CandidateProfile.js";

 
export class PrismaCandidateProfileRepo implements ICandidateProfileRepository{
    constructor(private prisma:PrismaClient){}

    async findByUserId(userId: string): Promise<CandidateProfile | null> {
        const raw = await this.prisma.candidateProfile.findUnique({
            where:{userId},
        }) 
        console
        if(!raw) return null

        return new CandidateProfile({
            id:raw.id,
            userId:raw.userId,
            firstName:raw.firstName,
            lastName:raw.lastName,
            phone:raw.phone ??undefined,
            headline:raw.headline??undefined,
            bio:raw.bio ?? undefined,
            location:raw.location ?? undefined,
            websiteUrl:raw.webSiteUrl ?? undefined,
            githubUrl:raw.githubUrl ?? undefined,
            linkedinUrl:raw.linkedinUrl ?? undefined,
            resumeKey:raw.resumeKey ?? undefined,
            skills:(raw.skills as unknown as string[])??[] ,
            experience:(raw.experience as unknown as ExperienceItem[])?? [],
            education:(raw.education  as unknown as EducationItem[])?? [],
            createdAt:raw.createdAt,
            updatedAt:raw.updatedAt

        })
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

        return new CandidateProfile({
            id:raw.id,
            userId:raw.userId,
            firstName:raw.firstName,
            lastName:raw.lastName,
            phone:raw.phone ??undefined,
            headline:raw.headline??undefined,
            bio:raw.bio ?? undefined,
            location:raw.location ?? undefined,
            websiteUrl:raw.webSiteUrl ?? undefined,
            githubUrl:raw.githubUrl ?? undefined,
            linkedinUrl:raw.linkedinUrl ?? undefined,
            skills:(raw.skills as unknown as string[])??[] ,
            resumeKey:raw.resumeKey ?? undefined,
            experience:(raw.experience as unknown as ExperienceItem[])?? [],
            education:(raw.education  as unknown as EducationItem[])?? [],
            createdAt:raw.createdAt,
            updatedAt:raw.updatedAt

        })
    }

    async updateResumeKey(userId: string, resumeKey: string): Promise<CandidateProfile> {
        const raw = await this.prisma.candidateProfile.update({
            where:{userId},
            data:{resumeKey}
        })

        return new CandidateProfile({
            id:raw.id,
            userId:raw.userId,
            firstName:raw.firstName,
            lastName:raw.lastName,
            phone:raw.phone ??undefined,
            headline:raw.headline??undefined,
            bio:raw.bio ?? undefined,
            location:raw.location ?? undefined,
            websiteUrl:raw.webSiteUrl ?? undefined,
            githubUrl:raw.githubUrl ?? undefined,
            linkedinUrl:raw.linkedinUrl ?? undefined,
            skills:(raw.skills as unknown as string[])??[] ,
            resumeKey:raw.resumeKey ?? undefined,
            experience:(raw.experience as unknown as ExperienceItem[])?? [],
            education:(raw.education  as unknown as EducationItem[])?? [],
            createdAt:raw.createdAt,
            updatedAt:raw.updatedAt
        })
    }

}