import { NextFunction, Request, Response } from "express";
import { ICreateJobUseCase } from "../../application/use-case/CreateJobUseCase.js";
import {  z} from 'zod'
import { StatusCode } from "../../shared/StatusCode.js";
import { CompanyMessages } from "../../shared/constants/CompanyMessages.js";
import { IGetJOBCompany } from "../../application/interface/IGETJobCompany.js";

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
        private getJobsUseCase:IGetJOBCompany
    ){}

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

            const jobs = await this.getJobsUseCase.execute(companyId)
            
            res.status(StatusCode.OK).json({
                success:true, 
                data:jobs
            })

        } catch (error) {
            next(error)
        }
    }


}