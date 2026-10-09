import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GatewayModels } from "../../../infrastructure/ai/GatewayModels";
import { IClassfierIntent } from "../../agent/Models/Classifier";
import { MentorAgent } from "../../agent/Models/MentorAgent";
import { TYPES } from "../../../di/TYPES";
type intentType = 'STATIC_PROFILE'|'SEARCH_JOB'|'GENERAL_CHAT'

@injectable()
export class MentorChatUseCase{
    constructor(
        @inject(TYPES.IntentClassifier) private classifier:IClassfierIntent,
        @inject(TYPES.IMentorAgent) private mentorAgent:MentorAgent, 
        @inject(TYPES.IUserRepository) private userRepo:IUserRepository
        // private vectorSearch: VectorSearchService,
    ){}

    async execute({userId,message}:{userId:string,message:string}){
        const intent = await this.classifier.classify(message) as intentType

        // if(intent === 'STATIC_PROFILE'){
        //     const user = await this.userRepo.findById(userId)
        //     return{
        //         userReq:message,
        //         intent,
        //         response:`Here is your profile data:\n
        //             ${user?.toJSON()}
        //         `
        //     }
        // }
        // else if(intent === 'SEARCH_JOB'){
        //     const agentResult =  await this.mentorAgent.run(message,userId)
        //     const lastMessage = agentResult.messages[agentResult.messages.length-1]
            
        //     console.log('----> SEARCH_JOB_AgentSuccess')
        //     return{
        //         userReq:message,
        //         intent,
        //         response:lastMessage?.content || "I couldn't process that request"
        //     }
        // }
        //default general chat

        const agentResult =  await this.mentorAgent.run(message,userId)
        const lastMessage = agentResult.messages[agentResult.messages.length-1]

        return{
            userReq:message,
            intent,
            response:lastMessage?.content || "I couldn't process that request"
        }


    }
}