import { NextFunction, Request, Response } from "express";
// import { IClassfierIntent } from "../../application/agent/Models/Classifier";
import { StatusCode } from "../../shared/constants/status-code.constant";
import { MentorChatUseCase } from "../../application/use-case/Candidate/mentor-chat.use-case";
import { IGETActiveJobs } from "../../application/interface/use-cases/Candidate/i-get-active-jobs.use-case";  
import { IGetActiveJobById } from "../../application/interface/use-cases/Candidate/i-get-jobs-by-id.use-case";  
import { ISaveCandidateProfile } from "../../application/interface/use-cases/Candidate/i-save-candidate-profile.use-case";  
import { IGetProfileCandidateUseCase } from "../../application/interface/use-cases/Candidate/i-get-profile-candidate.use-case";  
import { IGetResumeUrlUseCase } from "../../application/interface/use-cases/Candidate/i-get-resume-url.use-case";  
import { IProcessResumeUseCase } from "../../application/interface/use-cases/Candidate/i-process-resume.use-case";  
import { IGetUploadResumeUrlUseCase } from "../../application/interface/use-cases/Candidate/i-get-upload-resume-url.use-case";  
import { IGetCandidateInterviewUC } from "../../application/interface/use-cases/Candidate/i-get-candidate-interview.use-case";  
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { MentorChatRequestDTO, MentorChatSchema } from "../../application/dtos/Candidate/mentor-chat.dto";
import { GetActiveJobRequestDTO, GetActiveJobSchema } from "../../application/dtos/Candidate/get-active-job-id.dto";
import { SaveCandidateProfileSchema } from "../../application/dtos/Candidate/save-profile.dto";
import { GetProfileCandidateSchema } from "../../application/dtos/Candidate/get-profile-candidate.dto";
import { GetUploadResumeURLSchema } from "../../application/dtos/Candidate/get-upload-resume-url.dto";
import { GetResumeUrlSchema } from "../../application/dtos/Candidate/get-resume-url.dto";
import { ResponseHelper } from "../../shared/models/response.model";

@injectable()
export class CandidateController{
    constructor( 
        @inject(TYPES.IMentorChatUseCase) private mentorChatUseCase:MentorChatUseCase,
        @inject(TYPES.IGetActiveJobsUseCase) private getAllJobsUseCase:IGETActiveJobs,
        @inject(TYPES.IGetActiveJobById) private getJobDetailsUseCase:IGetActiveJobById,
        @inject(TYPES.ISaveCandidateProfile) private saveProfileuseCase:ISaveCandidateProfile,
        @inject(TYPES.IGetProfileCanidateUseCase) private getProfileCase:IGetProfileCandidateUseCase,
        @inject(TYPES.IGetUploadResumeUrlUseCase) private getUploadResumeUrlUseCase:IGetUploadResumeUrlUseCase,
        @inject(TYPES.IProcessResumeUseCase) private processResumeUseCase:IProcessResumeUseCase,
        @inject(TYPES.IGetResumeUrlUseCase) private getReadResumeUrlUseCase: IGetResumeUrlUseCase,
        @inject(TYPES.IGetCandidateInterviewUC) private getCandidateInterviewUseCase:IGetCandidateInterviewUC,

    ){}

    async handleAiMentorChat(req:Request,res:Response,next:NextFunction){
        console.log('req was hit:',req.body.message)
        try {
            const dto:MentorChatRequestDTO = MentorChatSchema.parse(req.body)
            const {userId,message} =dto
            if(!userId || !message){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"UserId and message prompt are required")
            }

            const response = await this.mentorChatUseCase.execute(dto)
            console.log(response)

            return ResponseHelper.success(res,StatusCode.OK,{
                data:response
            })
            // res.status(StatusCode.OK).json({
            //     success:true,
            //     data:response
            // })



        } catch (error) {
            next(error)
        }
    }

    async getActiveJobs(_:Request,res:Response,next:NextFunction){
        try {
            const jobs = await this.getAllJobsUseCase.execute()

            return ResponseHelper.success(res,StatusCode.OK,{
                data:jobs
            })
            // res.status(StatusCode.OK).json({
            //     success:true,
            //     data:jobs
            // })
            
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
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"JobId is required")
            }
            const jobData = await this.getJobDetailsUseCase.execute(dto)
            
            return ResponseHelper.success(res,StatusCode.OK,{
                data:typeof jobData.toJSON()==='function'? jobData.toJSON():jobData
            })
            // res.status(StatusCode.OK).json({
            //     success:true,
            //     data:typeof jobData.toJSON()==='function'? jobData.toJSON():jobData
            // })

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
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"User Id is required")
            }
            // const profileData = req.body
            const profile = await this.saveProfileuseCase.execute(dto)


            return ResponseHelper.success(res,StatusCode.OK,{
                data:profile.toJSON()
            },"Profile saved successfully")
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     message:"Profile saved successfully",
            //     data: profile.toJSON()
            // })
        } catch (error) {
            next(error)
        }
    }

    async getProfile(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetProfileCandidateSchema.parse({userId:req.user?.userId})
            const {userId} = dto

            if(!userId){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"User Id is required")
            }

            const profile = await this.getProfileCase.execute(dto) 

            return ResponseHelper.success(res,StatusCode.OK,{
                data: profile.toJSON()
            })
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     data: profile.toJSON()
            // })
        } catch (error) {
            next(error)
        }
    }

    async getResumeUploadUrl(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetUploadResumeURLSchema.parse(req.body)
            const {fileName,mimeType} = dto
            if(!fileName || !mimeType){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"fileName and mimeType are required")
            }
            const result = await this.getUploadResumeUrlUseCase.execute(dto)
            
            return ResponseHelper.success(res,StatusCode.OK,{
                result
            })
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     result
            // })

        } catch (error) {
            next(error)
        }
    }

    async processResume(req:Request,res:Response,next:NextFunction){
        try {
            const userId = req.user?.userId
            const {fileKey} = req.body
            if(!userId){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"User Id is required")
            }
            if(!fileKey){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"fileKey is required")
            }

            const result = await this.processResumeUseCase.execute(userId,fileKey)

            return ResponseHelper.success(res,StatusCode.OK,{
                result
            })
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     result
            // })

        } catch (error) {
            next(error)
        }
    }
    async getResumeUrl(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetResumeUrlSchema.parse({userId :req.user?.userId}) 
            if(!dto.userId){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"User Id is required")
            }
            const url = await this.getReadResumeUrlUseCase.execute(dto)

            return ResponseHelper.success(res,StatusCode.OK,{
                resumeUrl:url 
            })
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     resumeUrl:url 
            // })

        } catch (error) {
            next(error)
        }
    }

    async getAllInterviews(req:Request,res:Response,next:NextFunction){
        try { 
            const candidateId  = req.user?.userId 
            if(!candidateId){
                return ResponseHelper.error(res,StatusCode.BAD_REQUEST,"User Id is required")
            }
            const interviews = await this.getCandidateInterviewUseCase.execute(candidateId)
             
            return ResponseHelper.success(res,StatusCode.OK,{
                interviews
            })
            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     interviews
            // })

        } catch (error) {
            next(error)
        }
    }
}