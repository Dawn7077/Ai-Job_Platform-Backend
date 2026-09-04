import { Request, Response, Router } from "express";
import { ITokenService } from "../../infrastructure/repo/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {authorizeRole}from '../middleware/roleMiddleware.js'
import { UserRoleConstants } from "../../shared/constants/roles.js";
export function CandidateRoute(candidateController:any,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))
    router.use(authorizeRole(UserRoleConstants.CANDIDATE))

    router.get('/home',(req:Request,res:Response)=>{
        candidateController.getHome(req,res)
    })
    router.get('/chat',(req:Request,res:Response)=>{
        candidateController.getChat(req,res)
    })
     
}