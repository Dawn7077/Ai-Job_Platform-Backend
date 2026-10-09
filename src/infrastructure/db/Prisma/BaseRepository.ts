import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../di/TYPES";  

@injectable()
export class BaseRepository{
    constructor(@inject(TYPES.PrismaClient) protected readonly prisma:PrismaClient){}
}