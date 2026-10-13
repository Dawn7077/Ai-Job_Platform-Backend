import { NextFunction, Request, Response } from "express";
// import { IClassfierIntent } from "../../application/agent/Models/Classifier";
import { StatusCode } from "../../shared/StatusCode";
import { MentorChatUseCase } from "../../application/use-case/Candidate/MentorChatUseCase";
import { IGETActiveJobs } from "../../application/interface/I-UseCases/Candidate/IGETActiveJobs";  
import { IGetActiveJobById } from "../../application/interface/I-UseCases/Candidate/IGetActiveJobById";  
import { ISaveCandidateProfile } from "../../application/interface/I-UseCases/Candidate/ISaveCandidateProfile";  
import { IGetProfileCandidateUseCase } from "../../application/interface/I-UseCases/Candidate/IGetProfileCandidateUseCase";  
import { IGetResumeUrlUseCase } from "../../application/interface/I-UseCases/Candidate/IGetResumeUrlUseCase";  
import { IProcessResumeUseCase } from "../../application/interface/I-UseCases/Candidate/IProcessResumeUseCase";  
import { IGetUploadResumeUrlUseCase } from "../../application/interface/I-UseCases/Candidate/IGetUploadResumeUrlUseCase";  
import { IGetCandidateInterviewUC } from "../../application/interface/I-UseCases/Candidate/IGetCandidateInterviewUC";  
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { MentorChatRequestDTO, MentorChatSchema } from "../../application/dtos/Candidate/mentor-chat.dto";
import { GetActiveJobRequestDTO, GetActiveJobSchema } from "../../application/dtos/Candidate/Get-Active-JobId.dto";
import { SaveCandidateProfileSchema } from "../../application/dtos/Candidate/save-profile.dto";
import { GetProfileCandidateSchema } from "../../application/dtos/Candidate/get-profile-candidate.dto";
import { GetUploadResumeURLSchema } from "../../application/dtos/Candidate/get-upload-resumeURL.dto";
import { GetResumeUrlSchema } from "../../application/dtos/Candidate/Get-ResumeUrl.dto";

@injectable()
export class CandidateController{
    constructor( 
        @inject(TYPES.IMentorChatUseCase) private MentorUseCaseRepo:MentorChatUseCase,
        @inject(TYPES.IGetActiveJobsUseCase) private getAllJobsUseCase:IGETActiveJobs,
        @inject(TYPES.IGetActiveJobById) private getJobDetailsUseCase:IGetActiveJobById,
        @inject(TYPES.ISaveCandidateProfile) private saveProfileuseCase:ISaveCandidateProfile,
        @inject(TYPES.IGetProfileCanidateUseCase) private getProfileCase:IGetProfileCandidateUseCase,
        @inject(TYPES.IGetUploadResumeUrlUseCase) private getUploadRESUseCase:IGetUploadResumeUrlUseCase,
        @inject(TYPES.IProcessResumeUseCase) private processResumeUseCase:IProcessResumeUseCase,
        @inject(TYPES.IGetResumeUrlUseCase) private getReadResumeUrlUseCase: IGetResumeUrlUseCase,
        @inject(TYPES.IGetCandidateInterviewUC) private getCandidateInterviewUC:IGetCandidateInterviewUC,

    ){}

    async handleAiMentorChat(req:Request,res:Response,next:NextFunction){
        console.log('req was hit:',req.body.message)
        try {
            const dto:MentorChatRequestDTO = MentorChatSchema.parse(req.body)
            const {userId,message} =dto
            if(!userId || !message){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"UserId and message prompt are required"
                })
            }

            const response = await this.MentorUseCaseRepo.execute(dto)
            console.log(response)
            res.status(StatusCode.OK).json({
                success:true,
                data:response
            })



        } catch (error) {
            next(error)
        }
    }

    async getActiveJobs(_:Request,res:Response,next:NextFunction){
        try {
            const jobs = await this.getAllJobsUseCase.execute()

            res.status(StatusCode.OK).json({
                success:true,
                data:jobs
            })
            
        } catch (error) {
            next(error)
        }
    }
    async getJobDetailById(req:Request,res:Response,next:NextFunction){
        try {
            // const {id:jobId} = req.params
            const dto:GetActiveJobRequestDTO = GetActiveJobSchema.parse({jobId:req.params.id})
            const { jobId } =dto
            if(!jobId ||typeof jobId !=='string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"JobId is required"
                })
            }
            const jobData = await this.getJobDetailsUseCase.execute(dto)
            res.status(StatusCode.OK).json({
                success:true,
                data:typeof jobData.toJSON()==='function'? jobData.toJSON():jobData
            })

        } catch (error) {
            next(error)
        }
    }

    async saveProfile(req:Request,res:Response,next:NextFunction){
        try {
            // const userId = req.user?.userId
            const dto = SaveCandidateProfileSchema.parse({
                userId:req.user?.userId,
                profileData : req.body
            })
            if(!dto.userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            // const profileData = req.body
            const profile = await this.saveProfileuseCase.execute(dto)

            return res.status(StatusCode.OK).json({
                success:true,
                message:"Profile saved successfully",
                data: profile.toJSON()
            })
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetProfileCandidateSchema.parse({userId:req.user?.userId})
            const {userId} = dto

            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }

            const profile = await this.getProfileCase.execute(dto) 

            return res.status(StatusCode.OK).json({
                success:true,
                data: profile.toJSON()
            })
        } catch (error) {
            next(error)
        }
    }

    async getResumeUploadUrl(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetUploadResumeURLSchema.parse(req.body)
            const {fileName,mimeType} = dto
            if(!fileName || !mimeType){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"fileName and mimeType are required"
                })
            }
            const result = await this.getUploadRESUseCase.execute(dto)
            
            return res.status(StatusCode.OK).json({
                success:true,
                result
            })

        } catch (error) {
            next(error)
        }
    }

    async processResume(req:Request,res:Response,next:NextFunction){
        try {
            const userId = req.user?.userId
            const {fileKey} = req.body
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            if(!fileKey){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"fileKey is required"
                })
            }

            const result = await this.processResumeUseCase.execute(userId,fileKey)

            return res.status(StatusCode.OK).json({
                success:true,
                result
            })

        } catch (error) {
            next(error)
        }
    }
    async getResumeUrl(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetResumeUrlSchema.parse({userId :req.user?.userId}) 
            if(!dto.userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            const url = await this.getReadResumeUrlUseCase.execute(dto)

            return res.status(StatusCode.OK).json({
                success:true,
                resumeUrl:url 
            })

        } catch (error) {
            next(error)
        }
    }

    async getAllInterviews(req:Request,res:Response,next:NextFunction){
        try { 
            const candidateId  = req.user?.userId 
            if(!candidateId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            const interviews = await this.getCandidateInterviewUC.execute(candidateId)
             

            return res.status(StatusCode.OK).json({
                success:true,
                interviews
            })

        } catch (error) {
            next(error)
        }
    }
}