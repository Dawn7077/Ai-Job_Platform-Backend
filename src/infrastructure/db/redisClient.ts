import {Redis} from 'ioredis'

export interface ICacheService{
    set(key:string,value:string,expiryInSeconds?:number):Promise<void>
    get(key:string):Promise<string|null>
    del(key:string):Promise<number>
    ttl(key:string):Promise<number>
}

const redisClient = new Redis({
    host:process.env.REDIS_HOST || 'localhost',
    port:Number(process.env.REDIS_PORT) || 6379,
})

redisClient.on('error',(err)=> console.error("Redis Error:",err))

export default redisClient

// export class RedisService implements ICacheService{
//     constructor(private redis_client:Redis){}

//     async set(key: string, value: string, expiryInSeconds?: number): Promise<void> {
//         if(expiryInSeconds){
//             await this.redis_client.set(key,value,'EX',expiryInSeconds)
//         }else{
//             await this.redis_client.set(key,value)
//         }
//     }

//     async get(key: string): Promise<string | null> {
//         return this.redis_client.get(key)
//     }

//     async del(key: string): Promise<number> {
//         return await this.redis_client.del(key)
//     }
// }
