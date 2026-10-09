import 'reflect-metadata'
import {Container} from 'inversify'
import {TYPES} from './TYPES'

import {PrismaClient} from '@prisma/client'
import clientConnection from '../infrastructure/db/Mongo/MongoConnection'  
import redisClient from '../infrastructure/db/Redis/redisClient'
import s3Client,{R2StorageService} from '../infrastructure/services/r2StorageService'
import { GatewayModels } from '../infrastructure/ai/GatewayModels'
 
import {authModule} from './modules/auth.module'
import { candidateModule } from './modules/candidate.module'
import { companyModule } from './modules/company.module'
import { adminModule } from './modules/adminModule'


const container = new Container()

container.bind<PrismaClient>(TYPES.PrismaClient).toConstantValue(new PrismaClient())
container.bind(TYPES.RedisClient).toConstantValue(redisClient)
container.bind(TYPES.MongoClient).toConstantValue(clientConnection)
container.bind(TYPES.S3Client).toConstantValue(s3Client)

container.bind(TYPES.JwtSecret).toConstantValue(process.env.JWT_SECRET || '"Default_SecretKey"')
container.bind(TYPES.GatewayModel).to(GatewayModels)
container.bind(TYPES.EmbeddingsModel).toDynamicValue(()=>{
    const gateway= container.get<GatewayModels>(TYPES.GatewayModel)
    return gateway.EmbeddingsModel
}).inSingletonScope() 

container.load(authModule)
container.load(candidateModule)
container.load(companyModule)
container.load(adminModule)

export {container}