import { CandidateProfile as PrismaCandidateProfile } from "@prisma/client";
import { CandidateProfile,EducationItem,ExperienceItem } from "../../../domain/entities/CandidateProfile";

export class CandidateProfileMapper{
    static toDomain(record:PrismaCandidateProfile):CandidateProfile{
        return new CandidateProfile({
            id:record.id,
            userId:record.userId,
            firstName:record.firstName,
            lastName:record.lastName,
            phone:record.phone ??undefined,
            headline:record.headline??undefined,
            bio:record.bio ?? undefined,
            location:record.location ?? undefined,
            websiteUrl:record.webSiteUrl ?? undefined,
            githubUrl:record.githubUrl ?? undefined,
            linkedinUrl:record.linkedinUrl ?? undefined,
            resumeKey:record.resumeKey ?? undefined,
            skills:(record.skills as unknown as string[])??[] ,
            experience:(record.experience as unknown as ExperienceItem[])?? [],
            education:(record.education  as unknown as EducationItem[])?? [],
            createdAt:record.createdAt,
            updatedAt:record.updatedAt
        })
    }
}