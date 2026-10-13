import { NextFunction, Request, Response } from "express";
import { IApplyJobUseCase } from "../../application/interface/use-cases/Candidate/i-apply-job.use-case";  
import { StatusCode } from "../../shared/constants/status-code.constant";
import { IGetCandidateALLAppications } from "../../application/interface/use-cases/Candidate/i-get-candidate-all-applications.use-case";  
import { IGetCandidateApplication } from "../../application/interface/use-cases/Candidate/i-get-candidate-application.use-case";  
import { IUpdateApplicationStageUseCase } from "../../application/interface/use-cases/Company/i-update-application-stage.use-case";  
import { ApplicationStage } from "../../domain/entities/application.entity";
import { IGetAllApplications_Company } from "../../application/interface/use-cases/Company/i-get-all-applications-company.use-case";  
import { IGetApplication_Company } from "../../application/interface/use-cases/Company/i-get-application-details.use-case";  
import { ApplyJobSchema } from "../../application/dtos/Candidate/apply-job.dto";
import { GetCandidateApplicationSchema } from "../../application/dtos/Candidate/get-all-applications.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { ResponseHelper } from "../../shared/models/response.model";

@injectable()
export class ApplicationController{
    constructor(
       @inject(TYPES.IApplyJobUseCase) private applyJobUseCase:IApplyJobUseCase,
       @inject(TYPES.IGetActiveJobsUseCase) private getAllJobsUseCase:IGetCandidateALLAppications,
       @inject(TYPES.IGetCandidateApplicationUC) private findApplicationUseCase:IGetCandidateApplication, 

    ){}

    apply = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const {jobId,resumeUrl} = req.body
            const candidateId = req.user?.userId
            if(!candidateId)
                return ResponseHelper.error(res, StatusCode.UNAUTHORIZED, "User Id missing, UNAUTHORIZED")
            
            const dto = ApplyJobSchema.parse({
                ...req.body,
                candidateId
            })
            const application = await this.applyJobUseCase.execute(dto) 
            console.log('application=>\n',application.toJSON())
            
            // res.status(StatusCode.OK).json({
            //     success:true,
            //     data:application.toJSON(),
            // })
            return ResponseHelper.success(res, StatusCode.OK, {
                data: application.toJSON()
            });
        } catch (error) {
            next(error)
        }
    }

    AllMyApplications = async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const candidateId = req.user?.userId
            if(!candidateId)
                return ResponseHelper.error(res, StatusCode.UNAUTHORIZED, "User Id missing, UNAUTHORIZED")

            const applications = await this.getAllJobsUseCase.execute({candidateId})

            return ResponseHelper.success(res,StatusCode.OK,{ 
                data:applications.map(app=>app.toJSON())
            })

        } catch (error) {
            next(error)
        }
    }

    getApplicationById = async(req:Request,res:Response,next:NextFunction)=>{
        try { 

            const candidateId = req.user?.userId
            if(!candidateId){
                return ResponseHelper.error(res, StatusCode.UNAUTHORIZED, "User Id missing, UNAUTHORIZED")
            }
           

            const {id : applicationId} = req.params
            if(!applicationId || typeof applicationId !== 'string'){
                return ResponseHelper.error(res, StatusCode.UNAUTHORIZED,"Invalid Application ID")

                // return res.status(StatusCode.UNAUTHORIZED).json({
                //     success:false,
                //     error:"Invalid Application ID"
                // })
            }
            const dto = GetCandidateApplicationSchema.parse({
                candidateId,
                applicationId
            })

            const result = await this.findApplicationUseCase.execute(dto)//error

            return ResponseHelper.success(res,StatusCode.OK,{ 
                data:result,
            })

        } catch (error) {
           next(error) 
        }
    }



}
