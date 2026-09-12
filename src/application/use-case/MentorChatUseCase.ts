import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { GatewayModels } from "../../infrastructure/gateways/GatewayModels.js";
import { IClassfierIntent } from "../agent/Classifier.js";
import { MentorAgent } from "../agent/MentorAgent.js";
type intentType = 'STATIC_PROFILE'|'SEARCH_JOB'|'GENERAL_CHAT'
export class MentorChatUseCase{
    constructor(
        private classifier:IClassfierIntent,
        private mentorAgent:MentorAgent, 
        private userRepo:IUserRepository
        // private vectorSearch: VectorSearchService,
    ){}

    async execute({userId,message}:{userId:string,message:string}){
        const intent = await this.classifier.classify(message) as intentType

        if(intent === 'STATIC_PROFILE'){
            const user = await this.userRepo.findById(userId)
            return{
                userReq:message,
                intent,
                response:`Here is your profile data:\n
                    ${user?.toJSON()}
                `
            }
        }
        else if(intent === 'SEARCH_JOB'){
            // need to complete vector search first
            return{
                userReq:message,
                intent,
                response:'Job search via vector search is currently under development'
            }
        }
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