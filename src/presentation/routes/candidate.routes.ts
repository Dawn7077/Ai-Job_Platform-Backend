import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/services/i-token.service";
import { authMiddleware } from "../middleware/auth.middleware";
import {authorizeRole}from '../middleware/role.middleware'
import { UserRole } from "../../shared/constants/roles.constant";
import { CandidateController } from "../controller/candidate.controller";

export function CandidateRoute(candidateController:CandidateController,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRole.CANDIDATE))

    // router.get('/home',(req:Request,res:Response,next:NextFunction)=>{
    //     candidateController.getHome(req,res)
    // })
    router.post('/ai-chat',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.handleAiMentorChat(req,res,next)
    })

    router.get('/jobs',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getActiveJobs(req,res,next)
    })
    router.get('/jobs/:id',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getJobDetailById(req,res,next)
    })
    router.get('/profile',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getProfile(req,res,next)
    })
    router.post('/profile',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.saveProfile(req,res,next)
    })
    router.post('/resume/upload-url',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getResumeUploadUrl(req,res,next)
    })
    router.post('/resume/process',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.processResume(req,res,next)
    })
    router.get('/resume/url',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getResumeUrl(req,res,next)
    })
    router.get('/interviews',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getAllInterviews(req,res,next)
    })
     
    return router
}