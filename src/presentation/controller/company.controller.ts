import { NextFunction, Request, Response } from "express";
import { ICreateJobUseCase } from "../../application/interface/use-cases/Company/i-create-job.use-case";  
import { string, z } from 'zod'
import { StatusCode } from "../../shared/constants/status-code.constant";
import { CompanyMessages } from "../../shared/constants/company-messages.constant";
import { IGetJOBCompany } from "../../application/interface/use-cases/Company/i-get-company-jobs.use-case";
import { IGetAllApplications_Company } from "../../application/interface/use-cases/Company/i-get-all-applications-company.use-case"; 
import { IGetApplication_Company } from "../../application/interface/use-cases/Company/i-get-application-details.use-case";  
import { IScheduleInterviewUC } from "../../application/interface/use-cases/Company/i-schedule-interview.use-case"; 
import { IGetInterviewByRoomKeyUC } from "../../application/interface/use-cases/Company/i-get-interview-by-room-key.use-case";  
import { ISubmitInterviewEvaluationUC } from "../../application/interface/use-cases/Company/i-submit-interview-evaluation.use-case"; 
import { IGetApplicationByJobIdUC } from "../../application/interface/use-cases/Company/i-get-applications-by-jobId.use-case";  
import { ApplicationStage } from "@prisma/client";
import { IUpdateApplicationStageUseCase } from "../../application/interface/use-cases/Company/i-update-application-stage.use-case";  
import { ISaveProfileCompanyUC } from "../../application/interface/use-cases/Company/i-save-company-profile.use-case";  
import { IGetProfileCompanyUC } from "../../application/interface/use-cases/Company/i-get-company-profile.use-case"; 
import { IGetCompanyInterviewUC } from "../../application/interface/use-cases/Company/i-get-company-interviews.use-case"; 
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { CreateJobSchema, UpdateJobSchema } from "../../application/dtos/Company/create-job.dto";
import { IUpdateJobUseCase } from "../../application/use-case/Company/update-job.use-case";
import { DeleteJobParamSchema } from "../../application/dtos/Company/delete-job.dto";
import { IDeleteJobUseCase } from "../../application/use-case/Company/delete-job.use-case";
import { GetCompanyApplicationsSchema } from "../../application/dtos/Company/applications.dto";
import { ResponseHelper } from "../../shared/models/response.model";
import { ApplicationDetailsParamSchema } from "../../application/dtos/Company/application-details.dto";
import { UpdateApplicationParamSchema, UpdateApplicationStageRequestSchema } from "../../application/dtos/Company/update-application.dto";
import { ScheduleInterviewSchema } from "../../application/dtos/Company/schedule-interview.dto";
import { GetInterviewByRoomKeyParamSchema } from "../../application/dtos/Interview/get-by-room-key.dto";
import { SubmitEvaluationBodySchema, SubmitEvaluationParamSchema } from "../../application/dtos/Interview/submit-evaluation.dto";

const createJobSchema = z.object({
    title:z.string().min(3,'Title must be at least 3 characters'),
    jobType:z.enum(['REMOTE','HYBRID','ONSITE']),
    description:z.string().min(20,"description must be detailed (min 20 characters)"),
    skills:z.array(z.string()).min(1,'select at 1 skill'),
    salaryMax:z.number().positive(),
    salaryMin:z.number().positive(),
})


@injectable()
export class CompanyController{
    constructor(
        @inject(TYPES.ICreateJob) private createJobUseCase:ICreateJobUseCase,
        @inject(TYPES.IUpdateJobUseCase) private udpateJobUseCase:IUpdateJobUseCase,
        @inject(TYPES.IDeleteJobUseCase) private deleteJobUseCase:IDeleteJobUseCase,
        @inject(TYPES.IGetJobsUseCase) private getJobsUseCase:IGetJOBCompany,
        @inject(TYPES.IGetAllApplications_Company) private getAllapplicationUseCase:IGetAllApplications_Company,
        @inject(TYPES.IGetApplicationByJobIdUC) private getApplicationsByJobIdUC:IGetApplicationByJobIdUC,
        @inject(TYPES.IGetApplication_Company) private getApplicationdetailsUC :IGetApplication_Company,
        @inject(TYPES.IUpdateApplicationStageUseCase) private updateApplicationUseCase:IUpdateApplicationStageUseCase,
        @inject(TYPES.IScheduleInterviewUC) private scheduleUseCase:IScheduleInterviewUC,
        @inject(TYPES.IGetInterviewByRoomKeyUC) private getByRoomKeyUC:IGetInterviewByRoomKeyUC,
        @inject(TYPES.ISubmitInterviewEvaluationUC) private submitEvalutionUsecase:ISubmitInterviewEvaluationUC,
        @inject(TYPES.ISaveProfileCompanyUC) private saveProfileUseCase:ISaveProfileCompanyUC,
        @inject(TYPES.IGetProfileCompanyUC) private getProfileUseCase:IGetProfileCompanyUC,
        @inject(TYPES.IGetCompanyInterviewUC) private getCompanyInterviewUC:IGetCompanyInterviewUC

        // private getJobsTypeUseCase:IGetJOBTypeCompany
    ){}

    saveProfile = async (req:Request,res:Response,next:NextFunction)=>{
        try {
            const userId = req.user?.userId
            if(!userId){
                return ResponseHelper.error(
                    res,
                    StatusCode.BAD_REQUEST,
                    'User Id is required'
                )

                // return res.status(StatusCode.BAD_REQUEST).json({
                //     success:false,
                //     message:'User Id is required'
                // })
            }
            const profileData = req.body
            const profile = await this.saveProfileUseCase.execute(userId,profileData)

            // return res.status(StatusCode.OK).json({
            //     success:true,
            //     message:"Company profile saved successfully",
            //     data:profile.toJSON()
            // })

            return ResponseHelper.success(
                res,
                StatusCode.OK,
                profile.toJSON(),
            )
             
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
            const validatedData = CreateJobSchema.parse(req.body)
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

            const job  = await this.createJobUseCase.execute(
                companyId, 
                validatedData
            )

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

    updateJob =  async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const jobId = req.params.jobId
            const validatedData = UpdateJobSchema.parse(req.body) 
            const companyId = req.user?.userId 

            if(!companyId  ){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:CompanyMessages.MISSING_NAME_ID
                })
            }
            if(!jobId || typeof jobId !== 'string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:'job Id missing'
                })
            }

            const job  = await this.udpateJobUseCase.execute(
                jobId,companyId, 
                validatedData
            )

            res.status(StatusCode.CREATED).json({
                success:true,
                data: job.toJSON(),
            })
             
        } catch (error) {
            next(error)
        }
    }

    deleteJob =  async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {jobId} = DeleteJobParamSchema.parse(req.params) 
            const companyId = req.user?.userId 

            if(!companyId  ){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:CompanyMessages.MISSING_NAME_ID
                })
            }
            if(!jobId || typeof jobId !== 'string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:'job Id missing'
                })
            }

            await this.deleteJobUseCase.execute(
                jobId,companyId,  
            )

            res.status(StatusCode.CREATED).json({
                success:true,
                message: "Job successfully deleted",
            })
             
        } catch (error) {
            next(error)
        }
    }



    getAllApplications = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const dto  = GetCompanyApplicationsSchema.parse(req.user?.userId)
            const {companyId} = dto
            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }
            const applications = await this.getAllapplicationUseCase.execute(dto)
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
            const {status} = (req.body)

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
            const dto = ApplicationDetailsParamSchema.parse(req.params)
            const {jobId,id:applicationId} = dto

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
            
            const application = await this.getApplicationdetailsUC.execute(companyId,dto)

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

            const companyId = req.user?.userId

            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    error:"User Id missing, UNAUTHORIZED"
                })
            }

            const applicationDTO =UpdateApplicationParamSchema.parse(req.params)
            const stageDTO = UpdateApplicationStageRequestSchema.parse(req.body)
           
            const {id:applicationId} =applicationDTO
            const {stage} = stageDTO

            if(!applicationId || typeof applicationId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Application ID"
            })


            if(!stage || !Object.values(ApplicationStage).includes(stage)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    error:"Invalid application stage provided"
                })
            }

            const updatedApplication = await this.updateApplicationUseCase.execute(companyId,applicationDTO,stageDTO)

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
            
            if(!companyId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:CompanyMessages.UNAUTHORIZED
                })
            }
            const dto = ScheduleInterviewSchema.parse(req.body)
            // const {applicationId,candidateId,scheduledAt} = dto

            const result = await this.scheduleUseCase.execute({...dto,companyId})
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
            const {roomKey} = GetInterviewByRoomKeyParamSchema.parse(req.params)
            if(!roomKey || typeof roomKey !== 'string')return res.status(StatusCode.BAD_REQUEST).json({
                success:false,
                error:"Invalid roomKey provided"
            })
            const result = await this.getByRoomKeyUC.execute({roomKey})
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
            const {interviewId} = SubmitEvaluationParamSchema.parse(req.params)
            const dto = SubmitEvaluationBodySchema.parse(req.body)
            
            if(!interviewId || typeof interviewId !== 'string')return res.status(StatusCode.BAD_REQUEST).json({
                success:false,
                error:"Invalid interview ID"
            }) 
            
            const result = await this.submitEvalutionUsecase.execute({
                interviewId,
                ...dto
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