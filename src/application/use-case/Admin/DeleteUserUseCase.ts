import { inject, injectable } from "inversify";
import { IJobRepository } from "../../../domain/repositories/IJobRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IVectorSearchService } from "../../interface/I-Services/IVectorSearchService";
import { IDeleteUserUseCase } from "../../interface/I-UseCases/Admin/IDeleteUserUseCase";
import { AppError } from "../../../shared/AppErrors";
import { StatusCode } from "../../../shared/StatusCode"; 
import { TYPES } from "../../../di/TYPES";
import { DeleteUserParamDTO } from "../../dtos/Admin/DeleteUsers.dto";
import { ICacheService } from "../../../infrastructure/db/Redis/redisClient";
import { logger } from "../../../shared/utils/loggers";



@injectable()
export class DeleteUserUseCase implements IDeleteUserUseCase{
    constructor(
        @inject(TYPES.IUserRepository) private userRepo:IUserRepository,
        @inject(TYPES.IJobRepo) private jobRepo:IJobRepository,
        @inject(TYPES.IVectorSearchService) private vectorSearchService:IVectorSearchService,
        @inject(TYPES.RedisClient) private redisClient:ICacheService
    ){}

    async execute({id:userId}:DeleteUserParamDTO,adminId:string){
        const user = await this.userRepo.findById(userId)
        if(!user){
            throw new AppError(
                'User not found',
                StatusCode.NOT_FOUND,
                'NOT_FOUND'
            )
        }
        const adminUser = await this.userRepo.findById(adminId)
        if(!adminId && adminUser?.getRole() !=='ADMIN'){
            throw new AppError(
                'Unauthorised access of user management/delete.',
                StatusCode.FORBIDDEN,
                'FORBIDDEN'
            )
        }

        if(user.getRole()==='COMPANY'){
            const companyJobs = await this.jobRepo.findbyCompanyId(userId)
            const jobIds = companyJobs.map(j=>j.id)
            
            if(jobIds.length>0){
                await this.vectorSearchService.deleteJobEmbeddingsbyJobIds(jobIds)
            }
        }
        logger.warn(`deleting user account:${userId}`)
        await this.userRepo.deleteUser(userId)
        // await this.userRepo.HardDeleteUser(userId)
        await this.redisClient.del(`refresh_token:${userId}`)
        
        // 3. Cache deletion status in Redis so active access tokens fail instantly
        // await this.redisClient.set(`user_status:${userId}`, 'DELETED', 15 * 60) 
    }
}