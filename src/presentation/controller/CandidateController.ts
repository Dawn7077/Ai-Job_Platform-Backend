import { NextFunction, Request, Response } from "express";
import { IClassfierIntent } from "../../application/agent/Classifier.js";
import { StatusCode } from "../../shared/StatusCode.js";
import { MentorChatUseCase } from "../../application/use-case/MentorChatUseCase.js";


export class CandidateController{
    constructor( 
        private MentorUseCaseRepo:MentorChatUseCase

    ){}

    async handleAiMentorChat(req:Request,res:Response,next:NextFunction){
        console.log('req was hit:',req.body.message)
        try {
            const {userId,message} =req.body
            if(!userId || !message){
                return res.status(StatusCode.BAD_REQUEST).json({
                    success:false,
                    message:"UserId and message prompt are required"
                })
            }

            const response = await this.MentorUseCaseRepo.execute({userId,message})
            console.log(response)
            res.status(StatusCode.OK).json({
                success:true,
                data:response
            })



        } catch (error) {
            next(error)
        }
    }
}