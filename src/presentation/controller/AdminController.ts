import { NextFunction, Request, Response } from "express";
import { IGetPendingUsers } from "../../application/use-case/GetPendingUseCase.js";
import { IVerifyCompany } from "../../application/use-case/VerfiyingUserCase.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { AdminMessages } from "../../shared/constants/adminMessages.js";

export class AdminController{
    constructor(
        private GetPendingRepo:IGetPendingUsers,
        private VerifyCompanyRepo:IVerifyCompany
    ){}

    async handleGetPendingUsers(req:Request,res:Response,next:NextFunction){
        try {
            const users = await this.GetPendingRepo.execute()
            const pendingCompanies = users.map(user=> user.toJSON())

            res.status(StatusCode.OK).json({
                success:true,
                companies:pendingCompanies
            })
        } catch (error) {
            next(error)
        }
    }

    async verifyCompany(req:Request,res:Response,next:NextFunction){
        try {
            const {userId,status} = req.body

            if(!userId || !['ACTIVE','SUSPENDED'].includes(status)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.MISSING_USER_ID_STATUS
                })
            }

            const result = await this.VerifyCompanyRepo.execute(userId,status)

            res.status(StatusCode.OK).json({
                success:true,
                message:`${result.message}`
            })
        } catch (error) {
            next(error)
        }
    }

}