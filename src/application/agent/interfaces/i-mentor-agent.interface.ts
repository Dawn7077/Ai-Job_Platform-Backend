export interface IMentorAgent {
    run(message:string,candidateId:string,threadId:string):Promise<any>
}