
export interface IProcessResumeUseCase{
    execute(userId:string,fileKey:string):Promise<any>
}