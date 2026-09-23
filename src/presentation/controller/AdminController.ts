import { NextFunction, Request, Response } from "express";
import { IGetPendingUsers } from "../../application/use-case/Admin/GetPendingUseCase.js";
import { IVerifyCompany } from "../../application/use-case/Admin/VerfiyingUserCase.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { AdminMessages } from "../../shared/constants/adminMessages.js";
import { IUpdateUserStatusUC } from "../../application/use-case/Admin/UpdateUserStatusUseCase.js";
import { IUpdateUserRoleUC } from "../../application/use-case/Admin/UpdateUserRoleUseCase.js";
import { IGetUsersUseCase } from "../../application/use-case/Admin/GetUsersUseCase.js";
import { IDeleteUserUseCase } from "../../application/use-case/Admin/DeleteUserUseCase.js";

export class AdminController{
    constructor(
        private GetPendingRepo:IGetPendingUsers,
        private VerifyCompanyRepo:IVerifyCompany,
        private UpdateUserStatusUC:IUpdateUserStatusUC,
        private UpdateUserRoleUC:IUpdateUserRoleUC,
        private GetUsersUC:IGetUsersUseCase,
        private deleteUserUseCase:IDeleteUserUseCase,
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

    async getUsers(req:Request,res:Response,next:NextFunction){
        try {
            const {page,limit,role,status,search} = req.query
            const result = await this.GetUsersUC.execute({
                page:page as string,
                limit:limit as string,
                role:role as string,
                status:status as string,
                search:search as string
            })

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
            const {id:userId} = req.params
            const {status} = req.body
            const adminId = req.user?.userId

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
            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:'Unauthorised access of user management.'
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
            const {id:userId} = req.params
            const {role} = req.body
            const adminId = req.user?.userId
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
            if(!adminId){
                return res.status(StatusCode.UNAUTHORIZED).json({
                    success:false,
                    message:'Unauthorised access of user management.'
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
            const {id:userId} = req.params
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
            await this.deleteUserUseCase.execute(userId,adminId)
            
            return res.status(StatusCode.OK).json({
                success:true,
                message:`Successfully deleted the user account with user ID:${userId} `
            })


        } catch (error) {
            next(error)
        }
    }

}