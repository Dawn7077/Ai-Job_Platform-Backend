import { Request, Response, Router } from "express";
import { ITokenService } from "../../application/interface/ITokenService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export function CandidateRoute(candidateController:any,tokenTool:ITokenService){
    const router = Router()

    router.use(authMiddleware(tokenTool))

    router.get('/home',(req:Request,res:Response)=>{
        candidateController.getHome(req,res)
    })
    router.get('/chat',(req:Request,res:Response)=>{
        candidateController.getChat(req,res)
    })
     
}