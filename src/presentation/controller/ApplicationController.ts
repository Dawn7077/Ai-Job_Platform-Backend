import { NextFunction, Request, Response } from "express";
import { IApplyJobUseCase } from "../../application/interface/I-UseCases/Candidate/IApplyJobUseCase";  
import { StatusCode } from "../../shared/StatusCode";
import { IGetCandidateALLAppications } from "../../application/interface/I-UseCases/Candidate/IGetCandidateALLAppications";  
import { IGetCandidateApplication } from "../../application/interface/I-UseCases/Candidate/IGetCandidateApplication";  
import { IUpdateApplicationStageUseCase } from "../../application/interface/I-UseCases/Company/IUpdateApplicationStageUseCase";  
import { ApplicationStage } from "../../domain/entities/Application";
import { IGetAllApplications_Company } from "../../application/interface/I-UseCases/Company/IGetAllApplications_Company";  
import { IGetApplication_Company } from "../../application/interface/I-UseCases/Company/IGetApplication_Company";  


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
