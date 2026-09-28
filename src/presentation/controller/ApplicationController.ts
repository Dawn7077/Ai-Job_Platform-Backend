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



}
