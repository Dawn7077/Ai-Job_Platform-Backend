import { NextFunction, Request, Response } from "express";
// import { IClassfierIntent } from "../../application/agent/Models/Classifier.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { MentorChatUseCase } from "../../application/use-case/Candidate/MentorChatUseCase.js";
import { IGETActiveJobs } from "../../application/use-case/Candidate/GetJobsUseCase.js";
import { IGetActiveJobById } from "../../application/use-case/Candidate/GetActiveJobById.js";
import { ISaveCandidateProfile } from "../../application/use-case/Candidate/SaveCandidateProfile.js";
import { IGetProfileCandidateUseCase } from "../../application/use-case/Candidate/GetProfileCandidate.js";


export class CandidateController{
    constructor( 
        private MentorUseCaseRepo:MentorChatUseCase,
        private getAllJobsUseCase:IGETActiveJobs,
        private getJobDetailsUseCase:IGetActiveJobById,
        private saveProfileuseCase:ISaveCandidateProfile,
        private getProfileCase:IGetProfileCandidateUseCase,

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
}