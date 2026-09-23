import { NextFunction, Request, Response } from "express";
import { IApplyJobUseCase } from "../../application/use-case/Candidate/ApplyJobUseCase.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { IGetCandidateALLAppications } from "../../application/use-case/Candidate/GetAllApplications.js";
import { IGetCandidateApplication } from "../../application/use-case/Candidate/GetCandidateApplication.js";
import { IUpdateApplicationStageUseCase } from "../../application/use-case/Company/UpdateApplicationStage.js";
import { ApplicationStage } from "../../domain/entities/Application.js";
import { IGetAllApplications_Company } from "../../application/use-case/Company/GetAllApplications_Company.js";
import { IGetApplication_Company } from "../../application/use-case/Company/GetApplication_Company.js";


export class ApplicationController{
    constructor(
       private applyJobUseCase:IApplyJobUseCase,
       private getAllJobsUseCase:IGetCandidateALLAppications,
       private findApplicationUseCase:IGetCandidateApplication,
       private updateApplicationUseCase:IUpdateApplicationStageUseCase,
       private getCompanyAllApplicationsUseCase:IGetAllApplications_Company,
       private getCompanyApplicationUseCase:IGetApplication_Company,

    ){}

    apply = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {jobId,resumeUrl} = req.body
            const candidateId = req.user?.userId
            if(!candidateId)return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"User Id missing, UNAUTHORIZED"
            })
            const application = await this.applyJobUseCase.execute(candidateId,jobId,resumeUrl)
            console.log('application=>\n',application.toJSON())
            res.status(StatusCode.OK).json({
                success:true,
                data:application.toJSON(),
            })
        } catch (error) {
            next(error)
        }
    }

    AllMyApplications = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const candidateId = req.user?.userId
            if(!candidateId)return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"User Id missing, UNAUTHORIZED"
            })

            const applications = await this.getAllJobsUseCase.execute(candidateId)

            res.status(StatusCode.OK).json({
                success:true,
                data:applications.map(app=>app.toJSON())
            })

        } catch (error) {
            next(error)
        }
    }

    getApplicationById = async(req:Request,res:Response,next:NextFunction)=>{
        try {
        //    const {applicationId} = req.body
           const {id : applicationId} = req.params
           const candidateId = req.user?.userId
            if(!candidateId)return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"User Id missing, UNAUTHORIZED"
            })
            if(!applicationId || typeof applicationId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Application ID"
            })

            const result = await this.findApplicationUseCase.execute(candidateId,applicationId)

            res.status(StatusCode.OK).json({
                success:true,
                data:result,
            })

        } catch (error) {
           next(error) 
        }
    }

// company routes
    updateApplication = async(req:Request,res:Response,next:NextFunction)=>{
        try {
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

    getAllCompanyApplications = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const companyId = req.user?.userId
            if(!companyId)return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"User Id missing, UNAUTHORIZED"
            })

            const applications = await this.getCompanyAllApplicationsUseCase.execute(companyId)

            res.status(StatusCode.OK).json({
                success:true,
                data:applications.map(app=>app.toJSON())
            })


        } catch (error) {
            next(error)
        }
    }

    getCompanyApplication =  async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {jobId,id:applicationId} =req.params

            const companyId = req.user?.userId
            if(!companyId)return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"User Id missing, UNAUTHORIZED"
            })
            if(!applicationId || typeof applicationId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Application ID"
            })
            if(!jobId || typeof jobId !== 'string')return res.status(StatusCode.UNAUTHORIZED).json({
                success:false,
                error:"Invalid Job ID"
            })


            const application = await this.getCompanyApplicationUseCase.execute(companyId,applicationId,jobId)
           
            res.status(StatusCode.OK).json({
                success:true,
                data:application.toJSON(),
            })


        } catch (error) {
            next(error)
        }
    }


}
