import { NextFunction, Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/Interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {authorizeRole}from '../middleware/roleMiddleware.js'
import { UserRoleConstants } from "../../shared/constants/roles.js";
export function CandidateRoute(candidateController:any,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRoleConstants.CANDIDATE))

    router.get('/home',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.getHome(req,res)
    })
    router.post('/ai-chat',(req:Request,res:Response,next:NextFunction)=>{
        candidateController.handleAiMentorChat(req,res,next)
    })
     
    return router
}