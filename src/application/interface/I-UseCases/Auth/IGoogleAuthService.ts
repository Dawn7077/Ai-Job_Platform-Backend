export interface GoogleUserInfo{
    email:string
    name:string
    sub:string
}

export interface IGoogleAuthService{
    verifyandGetProfile(accessToken:string):Promise<GoogleUserInfo>
}