export interface IRefreshToken{
    execute(token:string):Promise<{accessToken:string}>
}