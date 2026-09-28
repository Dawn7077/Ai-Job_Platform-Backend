import { NextFunction, Request, Response } from "express";
// import { IClassfierIntent } from "../../application/agent/Models/Classifier.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { MentorChatUseCase } from "../../application/use-case/Candidate/MentorChatUseCase.js";
import { IGETActiveJobs } from "../../application/use-case/Candidate/GetJobsUseCase.js";
import { IGetActiveJobById } from "../../application/use-case/Candidate/GetActiveJobById.js";
import { ISaveCandidateProfile } from "../../application/use-case/Candidate/SaveCandidateProfile.js";
import { IGetProfileCandidateUseCase } from "../../application/use-case/Candidate/GetProfileCandidate.js";
import { IGetResumeUrlUseCase } from "../../application/use-case/Candidate/GetResumeUrlUseCase.js";
import { IProcessResumeUseCase } from "../../application/agent/use-case/ProcessUploadedResumeUC.js";
import { IGetUploadResumeUrlUseCase } from "../../application/use-case/Candidate/GetUploadResumeUrlUseCase.js";
import { IGetCandidateInterviewUC } from "../../application/use-case/Interview/GetCandidateInterviewUC.js";


export class CandidateController{
    constructor( 
        private MentorUseCaseRepo:MentorChatUseCase,
        private getAllJobsUseCase:IGETActiveJobs,
        private getJobDetailsUseCase:IGetActiveJobById,
        private saveProfileuseCase:ISaveCandidateProfile,
        private getProfileCase:IGetProfileCandidateUseCase,
        private getUploadRESUseCase:IGetUploadResumeUrlUseCase,
        private processResumeUseCase:IProcessResumeUseCase,
        private getReadResumeUrlUseCase: IGetResumeUrlUseCase,
        private getCandidateInterviewUC:IGetCandidateInterviewUC,

    ){}

    async handleAiMentorChat(req:Request,res:Response,next:NextFunction){
        console.log('req was hit:',req.body.message)
        try {
            const {userId,message} =req.body
            if(!userId || !message){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"UserId and message prompt are required"
                })
            }

            const response = await this.MentorUseCaseRepo.execute({userId,message})
            console.log(response)
            res.status(StatusCode.OK).json({
                success:true,
                data:response
            })



        } catch (error) {
            next(error)
        }
    }

    async getActiveJobs(req:Request,res:Response,next:NextFunction){
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
            const {id:jobId} = req.params
            if(!jobId ||typeof jobId !=='string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"JobId is required"
                })
            }
            const jobData = await this.getJobDetailsUseCase.execute(jobId)
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
            const userId = req.user?.userId
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            const profileData = req.body
            const profile = await this.saveProfileuseCase.execute(userId,profileData)

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
            const userId = req.user?.userId
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }

            const profile = await this.getProfileCase.execute(userId) 

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
            const {fileName,mimeType} = req.body
            if(!fileName || !mimeType){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"fileName and mimeType are required"
                })
            }
            const result = await this.getUploadRESUseCase.execute(fileName,mimeType)
            
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
            const userId = req.user?.userId 
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            const url = await this.getReadResumeUrlUseCase.execute(userId)

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