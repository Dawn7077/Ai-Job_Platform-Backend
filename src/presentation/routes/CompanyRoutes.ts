import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/I-Services/ITokenService";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorizeRole } from "../middleware/roleMiddleware";
import { UserRoleConstants } from "../../shared/constants/roles";
import { CompanyController } from "../controller/CompanyController";

export function CompanyRouter(
    companyController:CompanyController,
    tokenService:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenService))
    router.use(authorizeRole(UserRoleConstants.COMPANY))


// profile
    router.get('/profile',(req:Request,res:Response,next:NextFunction)=>{
        companyController.getProfile(req,res,next)
    })
    router.post('/profile',(req:Request,res:Response,next:NextFunction)=>{
        companyController.saveProfile(req,res,next)
    })


// jobroutes
    router.get('/jobs',(req:Request,res:Response,next:NextFunction)=>{
        companyController.getJobs(req,res,next)
    })
    router.post('/jobs',(req:Request,res:Response,next:NextFunction)=>{
        companyController.postJob(req,res,next)
    })

// application routes

    router.get('/applications',authorizeRole(UserRoleConstants.COMPANY),(req:Request,res:Response,next:NextFunction)=>{
        companyController.getAllApplications(req,res,next)
    })

    router.get('/application/:id/:jobId',authorizeRole(UserRoleConstants.COMPANY),(req:Request,res:Response,next:NextFunction)=>{
        companyController.getApplicationById(req,res,next)
    })
    router.get('/applications/:jobId',authorizeRole(UserRoleConstants.COMPANY),(req:Request,res:Response,next:NextFunction)=>{
        companyController.getApplicationByJobId(req,res,next)
    })
    router.patch('/applications/:id/stage',authorizeRole(UserRoleConstants.COMPANY),(req:Request,res:Response,next:NextFunction)=>{
        companyController.updateApplication(req,res,next)
    })
    

// interview routes
    router.get('/interviews',(req:Request,res:Response,next:NextFunction)=>{
        companyController.getAllInterviews(req,res,next)
    })

    router.post('/applications/interview',(req:Request,res:Response,next:NextFunction)=>{
        companyController.scheduleInterview(req,res,next)
    })
    router.get('/interview/room/:roomKey',(req:Request,res:Response,next:NextFunction)=>{
        companyController.getByRoomKey(req,res,next)
    })
    router.post('/interview/:interviewId/evaluation',(req:Request,res:Response,next:NextFunction)=>{
        companyController.submitEvalution(req,res,next)
    })

     
    return router
}