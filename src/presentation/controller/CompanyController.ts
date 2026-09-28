import { NextFunction, Request, Response } from "express";
import { ICreateJobUseCase } from "../../application/use-case/Company/CreateJobUseCase.js";
import {  success, z} from 'zod'
import { StatusCode } from "../../shared/StatusCode.js";
import { CompanyMessages } from "../../shared/constants/CompanyMessages.js";
import { IGetJOBCompany, IGetJOBTypeCompany } from "../../application/interface/IGETJobCompany.js";
import { IGetAllApplications_Company } from "../../application/use-case/Company/GetAllApplications_Company.js";
import { IGetApplication_Company } from "../../application/use-case/Company/GetApplication_Company.js";
import { IScheduleInterviewUC } from "../../application/use-case/Interview/ScheduleInterviewUseCase.js";
import { IGetInterviewByRoomKeyUC } from "../../application/use-case/Interview/GetInterviewByRoomKeyUC.js";
import { ISubmitInterviewEvaluationUC } from "../../application/use-case/Interview/SubmitEvaludationUseCase.js";
import { IGetApplicationByJobIdUC } from "../../application/use-case/Company/GetApplicationByJobIdUC.js";
import { ApplicationStage } from "@prisma/client";
import { IUpdateApplicationStageUseCase } from "../../application/use-case/Company/UpdateApplicationStage.js";
import { ISaveProfileCompanyUC } from "../../application/use-case/Company/SaveProfileCompanyUC.js";
import { IGetProfileCompanyUC } from "../../application/use-case/Company/GetProfileCompanyUC.js";
import { IGetCompanyInterviewUC } from "../../application/use-case/Interview/GetCompanyInterviewUC.js";

const createJobSchema = z.object({
    title:z.string().min(3,'Title must be at least 3 characters'),
    jobType:z.enum(['REMOTE','HYBRID','ONSITE']),
    description:z.string().min(20,"description must be detailed (min 20 characters)"),
    skills:z.array(z.string()).min(1,'select at 1 skill'),
    salaryMax:z.number().positive(),
    salaryMin:z.number().positive(),
})

export class CompanyController{
    constructor(
        private createJobUseCase:ICreateJobUseCase,
        private getJobsUseCase:IGetJOBCompany,
        private getAllapplicationUseCase:IGetAllApplications_Company,
        private getApplicationsByJobIdUC:IGetApplicationByJobIdUC,
        private getApplicationdetailsUC :IGetApplication_Company,
        private updateApplicationUseCase:IUpdateApplicationStageUseCase,
        private scheduleUseCase:IScheduleInterviewUC,
        private getByRoomKeyUC:IGetInterviewByRoomKeyUC,
        private submitEvalutionUsecase:ISubmitInterviewEvaluationUC,
        private saveProfileUseCase:ISaveProfileCompanyUC,
        private getProfileUseCase:IGetProfileCompanyUC,
        private getCompanyInterviewUC:IGetCompanyInterviewUC

        // private getJobsTypeUseCase:IGetJOBTypeCompany
    ){}

    saveProfile = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const userId = req.user?.userId
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:'User Id is required'
                })
            }
            const profileData = req.body
            const profile = await this.saveProfileUseCase.execute(userId,profileData)

            return res.status(StatusCode.OK).json({
                success:true,
                message:"Company profile saved successfully",
                data:profile.toJSON()
            })
             
        } catch (error) {
            next(error)
        }
    }

    getProfile = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const userId = req.user?.userId
            if(!userId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:'User Id is required'
                })
            } 
            const profile = await this.getProfileUseCase.execute(userId)

            return res.status(StatusCode.OK).json({
                success:true, 
                data:profile.toJSON()
            })
        } catch (error) {
            next(error)
        }
    }



    postJob = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const validatedData = createJobSchema.parse(req.body)
            // or 
            const companyId = req.user?.userId
            // const { companyId,companyName} 
            // const companyName =req.uyse

            if(!companyId  ){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:CompanyMessages.MISSING_NAME_ID
                })
            }

            const job  = await this.createJobUseCase.execute({
                companyId, 
                ...validatedData
            })

            res.status(StatusCode.CREATED).json({
                success:true,
                data: job.toJSON(),
            })
             
        } catch (error) {
            next(error)
        }
    }

    getJobs = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }

            const data = await this.getJobsUseCase.execute(companyId)
            
            res.status(StatusCode.OK).json({
                success:true, 
                data:data.jobList, 
            })

        } catch (error) {
            next(error)
        }
    }

    getAllApplications = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }
            const applications = await this.getAllapplicationUseCase.execute(companyId)
            const results = applications.map(app=>app.toJSON())
            
            res.status(StatusCode.OK).json({
                success:true, 
                applications:results, 
            })

        } catch (error) {
            next(error)
        }
    }

    getApplicationByJobId = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            const {jobId} = req.params
            const {status} = req.body

            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }
            if(!jobId || typeof jobId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Job ID"
            })
            
            const applications = await this.getApplicationsByJobIdUC.execute(companyId,jobId,status)

            res.status(StatusCode.OK).json({
                success:true, 
                applications:applications, 
            })
            

        } catch (error) {
            next(error)
        }
    }


    // specific application by id jobid and companyid
    getApplicationById = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            const {id:applicationId,jobId} = req.params

            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }
            if(!applicationId || typeof applicationId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Application ID"
            })
            if(!jobId || typeof jobId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Job ID"
            })
            
            const application = await this.getApplicationdetailsUC.execute(companyId,applicationId,jobId)

            res.status(StatusCode.OK).json({
                success:true, 
                application:application.toJSON(), 
            })
            

        } catch (error) {
            next(error)
        }
    }

    updateApplication = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            console.log('req hit updateApplication')
            const {id:applicationId} =req.params
            const {stage} = req.body
            const companyId = req.user?.userId

            if(!applicationId || typeof applicationId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Application ID"
            })

            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    error:"User Id missing, UNAUTHORIZED"
                })
            }

            if(!stage || !Object.values(ApplicationStage).includes(stage)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    error:"Invalid application stage provided"
                })
            }

            const updatedApplication = await this.updateApplicationUseCase.execute(companyId,applicationId,stage)

            res.status(StatusCode.OK).json({
                success:true,
                data:updatedApplication.toJSON(),
            })

            
        } catch (error) {
            next(error)
        }
    }



    scheduleInterview= async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            const {applicationId,candidateId,scheduledAt} = req.body

            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }

            const result = await this.scheduleUseCase.execute({applicationId,candidateId,companyId,scheduledAt})
            const data = {
                interview:result.interview.toJSON(), 
                application:result.application.toJSON(), 
            }
            res.status(StatusCode.OK).json({
                success:true, 
                data,
            })
            

        } catch (error) {
            next(error)
        }
    }

    getByRoomKey = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {roomKey} = req.params
            if(!roomKey || typeof roomKey !== 'string')return res.status(StatusCode.BAD_REQUEST).json({
                success:false,
                error:"Invalid roomKey provided"
            })
            const result = await this.getByRoomKeyUC.execute(roomKey)
            res.status(StatusCode.OK).json({
                success:true, 
                interview:result.toJSON(), 
            })

        } catch (error) {
            next(error)
        }
    }

    submitEvalution = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {interviewId} = req.params
            const {technicalScore,communicationScore,
                problemSolvingScore,notes,decision} = req.body
            if(!interviewId || typeof interviewId !== 'string')return res.status(StatusCode.BAD_REQUEST).json({
                success:false,
                error:"Invalid interview ID"
            })
            console.log('submitEvalution==>')
            
            const result = await this.submitEvalutionUsecase.execute({
                interviewId,
                technicalScore:Number(technicalScore),
                communicationScore:Number(communicationScore),
                problemSolvingScore:Number(problemSolvingScore),
                notes,decision
            })

            res.status(StatusCode.OK).json({
                success:true, 
                data:result.toJSON()
            })
            

        } catch (error) {
            next(error)
        }
    }

    getAllInterviews=async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId  = req.user?.userId 
            if(!companyId){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"User Id is required"
                })
            }
            const interviews = await this.getCompanyInterviewUC.execute(companyId)

            return res.status(StatusCode.OK).json({
                success:true,
                interviews
            })

        } catch (error) {
            next(error)
        }
    }

     
}