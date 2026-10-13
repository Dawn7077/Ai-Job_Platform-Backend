export type MessageRole = 'user' | 'model' | 'system'

export interface ChatMessageProps{
    id?:string
    userId:string
    role:MessageRole
    content:string
    createdAt?:Date
}

export class ChatMessage{
    private props: Required<ChatMessageProps>

    constructor(prop:ChatMessageProps){
        this.props ={
            id:prop.id ?? crypto.randomUUID(),
            userId:prop.userId,
            role:prop.role,
            content:prop.content,
            createdAt:prop.createdAt ?? new Date(),
        }
    }

    getId():string{
        return this.props.id
    }
    getUserId():string{
        return this.props.userId
    }
    getRole():string{
        return this.props.role
    }
    getContent():string{
        return this.props.content
    }

    toJSON(){
       return { ...this.props}
    }
}