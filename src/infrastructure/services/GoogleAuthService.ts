import { OAuth2Client } from "google-auth-library";
import { GoogleUserInfo, IGoogleAuthService } from "../../domain/interfaces/IGoogleAuthService.js";

export class Google_Service implements IGoogleAuthService{
    private client:OAuth2Client;

    constructor(){
        this.client = new OAuth2Client()
    }

    async verifyandGetProfile(accessToken: string): Promise<GoogleUserInfo> {
        this.client.setCredentials({access_token:accessToken})

        const response = await this.client.request<{email:string;name:string;sub:string}>({
            url:"https://www.googleapis.com/oauth2/v3/userinfo"
        })
        if(!response.data.email){
            throw new Error("Failed to retrieve valid email from Google")
        }

        return{
            email:response.data.email,
            name:response.data.name,
            sub:response.data.sub,
        }
    }
}