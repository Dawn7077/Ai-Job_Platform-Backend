import {Redis} from "ioredis"
import { ICacheService } from "../db/redisClient.js"


export class RedisService implements ICacheService{
    constructor(private redis_client:Redis){}

    async set(key: string, value: string, expiryInSeconds?: number): Promise<void> {
        if(expiryInSeconds){
            await this.redis_client.set(key,value,'EX',expiryInSeconds)
        }else{
            await this.redis_client.set(key,value)
        }
    }

    async get(key: string): Promise<string | null> {
        return this.redis_client.get(key)
    }

    async del(key: string): Promise<number> {
        return await this.redis_client.del(key)
    }

    async ttl(key: string): Promise<number> {
        return await this.redis_client.ttl(key)
    }
}
