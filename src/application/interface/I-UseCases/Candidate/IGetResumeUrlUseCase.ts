
export interface IGetResumeUrlUseCase{
    execute(userId: string): Promise<string>
}