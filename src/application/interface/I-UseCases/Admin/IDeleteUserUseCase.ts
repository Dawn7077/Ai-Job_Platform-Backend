export interface IDeleteUserUseCase{
    execute(userId: string,adminId: string): Promise<void>
}