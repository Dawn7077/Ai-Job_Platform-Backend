import { inject, injectable } from "inversify";
import { ICandidateProfileRepository } from "../../../domain/repositories/ICandidateProfileRepo";
import { GatewayModels } from "../../../infrastructure/ai/GatewayModels";
import { ResumeParserService } from "../../../infrastructure/ai/pdfParserService";
import { R2StorageService } from "../../../infrastructure/services/r2StorageService";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode";
import { IProcessResumeUseCase } from "../../interface/I-UseCases/Candidate/IProcessResumeUseCase";
import { TYPES } from "../../../di/TYPES";

@injectable()
export class ProcessResumeUseCase implements IProcessResumeUseCase{
    constructor(
        @inject(TYPES.ICandidateProfileRepo) private candidateRepo:ICandidateProfileRepository,
        @inject(TYPES.IResumeParserService) private resumeParserService:ResumeParserService,
        @inject(TYPES.GatewayModel) private aiService:GatewayModels,
        @inject(TYPES.IR2StorageService) private r2Service:R2StorageService,
    ){}

    async execute(userId: string, fileKey: string): Promise<any> {
        const fileBuffer = await this.r2Service.getFileBuffer(fileKey)
        const rawText = await this.resumeParserService.extractTextFromPdf(fileBuffer)
        if(!rawText || rawText.trim().length===0){
            throw new AppError(
                'Could not extract readable text from resume PDF.',
                StatusCode.BAD_REQUEST,
                "INVALID_RESUME_FILE"
            )
        }

        const prompt = `
            You are an expert HR Resume Parser.
            Extract key information and structured candidate information from the resume text below and calculate an initial ATS readiness (0 to 100) with
            key recommendations.

            Return ONLY a JSON object strictly matching this format(no markdown formatting or extra prose):
            {
                "skills":["string"],
                "experience":[{"company":"string","role":"string","duration":"string","summary":"string"}],
                "education":[{"institution":"string","degree":"string","year":"string"},],
                "bio":"string short professional headline/summary",
                "atsAnalysis":{
                    "score":85,
                    "strengths":["string"],
                    "improvements":["string"],
                    "suggestions":["string"],
                }
            }

            Resume Text:
            ${rawText}
        `

        const aiModel = this.aiService.fallbackModel
        const aiResponse = await aiModel.invoke(prompt)
        let parsedJSON
        try {
            const cleanedContent = String(aiResponse.content).replace(/```json|```/g,'').trim()
            parsedJSON = JSON.parse(cleanedContent)
        } catch (error) {
            console.error("Error on parsing AI JSON output:",aiResponse.content)
            throw new AppError(
                "Failed to format resume data into structured profile.",
                StatusCode.INTERNAL_SERVER_ERROR,
                "AI_PARSING_FAILED"
            );
        }

        const readResumeUrl = await this.r2Service.getPresignedReadUrl(fileKey)  

        const updatedProdfile = await this.candidateRepo.upsertProfile(userId,{
            skills:parsedJSON.skills || [],
            experience:parsedJSON.experience || [],
            education:parsedJSON.education || [],
            bio:parsedJSON.bio || [],
            resumeKey:fileKey
        })

        return {
            profile:updatedProdfile,
            resumeUrl:readResumeUrl,
            atsAnalysis:parsedJSON.atsAnalysis || null,
        }

    }
}