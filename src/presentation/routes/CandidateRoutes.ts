import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/I-Services/ITokenService";
import { authMiddleware } from "../middleware/authMiddleware";
import {authorizeRole}from '../middleware/roleMiddleware'
import { UserRoleConstants } from "../../shared/constants/roles";
import { CandidateController } from "../controller/CandidateController";

export function CandidateRoute(candidateController:CandidateController,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRoleConstants.CANDIDATE))

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