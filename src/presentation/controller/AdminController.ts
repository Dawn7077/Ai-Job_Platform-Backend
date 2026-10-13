import { NextFunction, Request, Response } from "express";
import { IGetPendingUsers } from "../../application/interface/I-UseCases/Admin/IGetPendingUsers";  
import { IVerifyCompany } from "../../application/interface/I-UseCases/Admin/IVerifyCompany";  
import { StatusCode } from "../../shared/StatusCode";
import { AdminMessages } from "../../shared/constants/adminMessages";
import { IUpdateUserStatusUC } from "../../application/interface/I-UseCases/Admin/IUpdateUserStatusUC";  
import { IUpdateUserRoleUC } from "../../application/interface/I-UseCases/Admin/IUpdateUserRoleUC"; 
import { IGetUsersUseCase } from "../../application/interface/I-UseCases/Admin/IGetUsersUseCase";  
import { IDeleteUserUseCase } from "../../application/interface/I-UseCases/Admin/IDeleteUserUseCase";  
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/TYPES";
import { DeleteUserParamSchema } from "../../application/dtos/Admin/DeleteUsers.dto";
import { GetUsersQuerySchema } from "../../application/dtos/Admin/getUsers.dto";
import { UpdateRoleBodySchema, UpdateRoleParamSchema } from "../../application/dtos/Admin/updateRole.dto";
import { UpdateStatusBodySchema, UpdateStatusParamSchema } from "../../application/dtos/Admin/updateStatus.dto";
import { VerifyCompanyBodySchema } from "../../application/dtos/Admin/VerifyCompany.dto";

@injectable()
export class AdminController{
    constructor(
        @inject(TYPES.IGetPendingUsersUseCase) private GetPendingRepo:IGetPendingUsers,
        @inject(TYPES.IVerifyCompanyUseCase) private VerifyCompanyRepo:IVerifyCompany,
        @inject(TYPES.IUpdateUserStatusUC) private UpdateUserStatusUC:IUpdateUserStatusUC,
        @inject(TYPES.IUpdateUserRoleUC) private UpdateUserRoleUC:IUpdateUserRoleUC,
        @inject(TYPES.IGetUsersUseCase) private GetUsersUC:IGetUsersUseCase,
        @inject(TYPES.IDeleteUserUseCase) private deleteUserUseCase:IDeleteUserUseCase,
    ){}

    async handleGetPendingUsers(_:Request,res:Response,next:NextFunction){
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
            const dto= VerifyCompanyBodySchema.parse(req.body)
            const {userId,status,reason}  = dto

            if(!userId || !['ACTIVE','SUSPENDED'].includes(status)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.MISSING_USER_ID_STATUS
                })
            }

            const result = await this.VerifyCompanyRepo.execute(dto)

            res.status(StatusCode.OK).json({
                success:true,
                message:`${result.message}`
            })
        } catch (error) {
            next(error)
        }
    }

    async getUsers(req:Request,res:Response,next:NextFunction){
        try {
            const dto = GetUsersQuerySchema.parse(req.query)
            const result = await this.GetUsersUC.execute(dto)

            res.status(StatusCode.OK).json({
                success:true,
                ...result
            })

        } catch (error) {
            next(error)
        }
    }
    
    async UpdateUserStatus(req:Request,res:Response,next:NextFunction){
        try {
            const adminId = req.user?.userId
            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:'Unauthorised access of user management.'
                })
            }

            const {id:userId} = UpdateStatusParamSchema.parse(req.params)
            const {status} = UpdateStatusBodySchema.parse(req.body)

            if(!status || !['ACTIVE','SUSPENDED',"PENDING"].includes(status)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.INVALID_STATUS
                })
            }   
            if(!userId || typeof userId !== 'string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.MISSING_USER_ID
                })
            }
            

            const result = await this.UpdateUserStatusUC.execute(userId,status,adminId)
            console.log('StatusUpdate=>',status,userId) 
            console.log('StatusUpdate=>',status,userId) 
            res.status(StatusCode.OK).json(result)
                
        } catch (error) {
            next(error)
        }
    }

    async UpdateUserRole(req:Request,res:Response,next:NextFunction){
        try {
            const adminId = req.user?.userId
            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:'Unauthorised access of user management.'
                })
            }

            const {id:userId} = UpdateRoleParamSchema.parse(req.params)
            const {role} = UpdateRoleBodySchema.parse(req.body)
            
            console.log('update role hit',userId)
            
            if(!role || !['CANDIDATE','COMPANY',"ADMIN"].includes(role)){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.INVALID_STATUS
                })
            }   
            if(!userId || typeof userId !== 'string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.MISSING_USER_ID
                })
            }
            

            const result = await this.UpdateUserRoleUC.execute(userId,role,adminId)
            res.status(StatusCode.OK).json(result)
                
        } catch (error) {
            next(error)
        }
    }

    async DeleteUser(req:Request,res:Response,next:NextFunction){
        try {
            const dto = DeleteUserParamSchema.parse(req.params)
            const {id:userId} = dto
            const adminId = req.user?.userId

            if(!userId || typeof userId !== 'string'){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:AdminMessages.MISSING_USER_ID
                })
            }

            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:'Unauthorised access of user management.'
                })
            }
            await this.deleteUserUseCase.execute(dto,adminId)
            
            return res.status(StatusCode.OK).json({
                success:true,
                message:`Successfully deleted the user account with user ID:${userId} `
            })


        } catch (error) {
            next(error)
        }
    }

}