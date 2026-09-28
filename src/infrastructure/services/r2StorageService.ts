import {S3Client, PutObjectCommand, GetObjectCommand, Bucket$} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
    region:'auto',
    endpoint:process.env.R2_ENDPOINT,
    credentials:{
        accessKeyId:process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey:process.env.R2_SECRET_ACCESS_KEY_ID || ''
    },
})
export default s3Client


export class R2StorageService {
    constructor(private s3Client:S3Client){}


    // to generate temp Presigned PUT url for direct browser uploads =>
    // this url will be  by react to upload directly performing a http put req with actual pdf file which R2 receives and saves sends back a 200 ok resp
    async getPresignedUploadUrl(fileName:string, mimeType:string):Promise<{uploadUrl: string;fileKey: string;}>{
        const fileExtension = fileName.split('.').pop()
        const fileKey = `resume/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`

        const command = new PutObjectCommand({
            Bucket:process.env.R2_BUCKET_NAME,
            Key:fileKey,
            ContentType:mimeType,
        })
        // Signed URL(mockUrl for public usage) that expires in 10 minutes
        const uploadUrl = await getSignedUrl(s3Client,command,{expiresIn:600})

        return  {uploadUrl, fileKey}
    }

    // r2 will be sending the data in streams which then Downloads 
    // the file into buffer bucket from R2 for local processing/parsing
    async getFileBuffer(fileKey:string){
        const command = new GetObjectCommand({
            Bucket:process.env.R2_BUCKET_NAME, 
            Key:fileKey
        })

        const response  = await s3Client.send(command)
        const byteArray = await response.Body?.transformToByteArray()

        if(!byteArray){
            throw new Error("Error on retriving file stream from R2")
        }

        return Buffer.from(byteArray)
    }


    async getPresignedReadUrl(fileKey:string):Promise<string>{
        const command = new GetObjectCommand({
            Bucket:process.env.R2_BUCKET_NAME,
            Key:fileKey,
        })

        return await getSignedUrl(s3Client,command,{expiresIn:3600})
    }
}
